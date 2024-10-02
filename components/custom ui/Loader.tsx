// Komponenta za prikaz loader-a (učitavača)
const Loader = () => {
    return (
      <div className="flex items-center justify-center bg-black h-screen">
        <div className="animate-spin rounded-full border-t-4 border-gold border-solid h-12 w-12"></div>
      </div>
    );
  }
  
  export default Loader;