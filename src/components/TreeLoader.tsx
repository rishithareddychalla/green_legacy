import { motion } from "framer-motion";

const TreeLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{
          scale: [0.5, 1, 0.8, 1],
          opacity: 1,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative"
      >
        {/* Tree Trunk */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 100 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-4 bg-green-800 mx-auto rounded-full origin-bottom"
        />

        {/* Tree Leaves */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
          className="absolute bottom-[80px] left-1/2 -translate-x-1/2"
        >
          <div className="w-32 h-32 bg-green-500 rounded-full opacity-80" />
          <div className="w-24 h-24 bg-green-600 rounded-full -mt-20 ml-8 opacity-80" />
          <div className="w-24 h-24 bg-green-400 rounded-full -mt-16 -ml-4 opacity-80" />
        </motion.div>

        {/* Falling Leaves */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 - 50,
              y: -20,
              opacity: 0,
              scale: 0
            }}
            animate={{ 
              x: Math.random() * 200 - 100,
              y: 100,
              opacity: [0, 1, 0],
              scale: [0, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut"
            }}
            className="absolute top-0 left-1/2"
          >
            <div className="w-3 h-3 bg-green-400 rounded-full" />
          </motion.div>
        ))}
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-20 text-lg font-medium text-muted-foreground"
      >
        Growing your legacy...
      </motion.p>
    </div>
  );
};

export default TreeLoader;