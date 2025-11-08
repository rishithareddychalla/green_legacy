import { motion } from "framer-motion";

const WhatsAppButton = () => {
  const whatsappNumber = "918074935169";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Green Legacy on WhatsApp"
      className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-[#25D366] p-3 rounded-full hover:bg-[#20bc5a] transition-colors duration-300">
        <svg
          width="32"
          height="32"
          viewBox="0 0 1219.547 1225.016"
          fill="#FFFFFF"
          aria-hidden="true"
        >
          <path
            d="M1041.858 178.02C927.206 63.289 774.753.07 612.325 0 277.617 0 5.232 272.298 5.098 606.991c-.039 106.986 27.915 211.42 81.048 303.476L0 1225.016l321.898-84.406c88.689 48.368 188.547 73.855 290.166 73.896h.258.003c334.654 0 607.08-272.346 607.222-607.023.056-162.208-63.052-314.724-177.689-429.463zm-429.533 933.963h-.197c-90.578-.048-179.402-24.366-256.878-70.339l-18.438-10.93-191.021 50.083 51-186.176-12.013-19.087c-50.525-80.336-77.198-173.175-77.16-268.504.111-278.186 226.507-504.503 504.898-504.503 134.812.056 261.519 52.604 356.814 147.965 95.289 95.36 147.728 222.128 147.688 356.948-.118 278.195-226.522 504.543-504.693 504.543z"/>
          <path
            d="M886.527 668.166c-33.934-16.936-39.832-16.936-49.729 3.496-9.897 20.433-38.416 65.39-45.483 76.456-.871 1.378-15.773 24.473-32.73 24.473l-32.73-16.936s-39.832-16.935-65.721-45.456c-25.889-28.52-49.73-65.39-49.73-65.39-16.936-28.52-16.936-45.456 0-45.456s28.52-33.934 28.52-45.456c-11.548-45.457-45.482-130.78-61.237-144.035-15.773-13.237-31.547-3.496-47.32 6.993-15.773 10.489-68.035 33.934-68.035 107.287s69.217 191.385 79.114 212.982c9.897 21.597 138.558 211.82 336.009 292.095 197.45 80.276 197.45 53.517 232.558 49.834 35.108-3.496 113.094-45.456 129.03-89.748 15.937-44.293 15.937-82.873 11.273-89.749-4.663-6.992-16.936-10.488-35.109-19.251z"
          />
        </svg>
      </div>
      <span className="sr-only">Chat with Green Legacy on WhatsApp</span>
      <div className="absolute -top-10 right-0 bg-white text-gray-800 px-3 py-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        Chat with Green Legacy
      </div>
    </motion.a>
  );
};

export default WhatsAppButton;