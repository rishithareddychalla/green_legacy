create table public.user_rewards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  green_points int default 0 not null,
  wallet_balance decimal(10,2) default 0.0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_rewards enable row level security;

create policy "Users can view their own rewards balance"
  on public.user_rewards for select
  using (auth.uid() = user_id);

create policy "Users can update their own rewards balance"
  on public.user_rewards for update
  using (auth.uid() = user_id);

create table public.rewards_transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text check (type in ('earned', 'redeemed')) not null,
  points int not null,
  description text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.rewards_transactions enable row level security;

create policy "Users can view their own rewards transactions"
  on public.rewards_transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert rewards transactions"
  on public.rewards_transactions for insert
  with check (auth.uid() = user_id);

-- Function to update rewards after a successful payment
create or replace function public.update_rewards_after_payment()
returns trigger as $$
begin
  -- Calculate points (10 points per tree)
  declare
    total_trees int;
    points_to_add int;
  begin
    select coalesce(sum(quantity), 0)
    into total_trees
    from jsonb_to_recordset(new.metadata->'trees') as x(quantity int);
    
    points_to_add := total_trees * 10;

    -- Insert transaction record
    insert into rewards_transactions (
      user_id,
      type,
      points,
      description
    ) values (
      new.user_id,
      'earned',
      points_to_add,
      format('Earned points for donating %s trees', total_trees)
    );

    -- Update user's rewards balance
    insert into user_rewards (
      user_id,
      green_points,
      wallet_balance
    ) values (
      new.user_id,
      points_to_add,
      0
    )
    on conflict (user_id) do update
    set green_points = user_rewards.green_points + points_to_add;
  end;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to update rewards after payment
create trigger update_rewards_after_payment
  after insert on payments
  for each row
  when (new.status = 'succeeded')
  execute function update_rewards_after_payment();

-- Create function to automatically update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Add trigger for updating updated_at
create trigger update_user_rewards_updated_at
  before update on user_rewards
  for each row
  execute function update_updated_at_column();