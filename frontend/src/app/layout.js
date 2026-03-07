import "./globals.css";

export const metadata = {
  title: "RiftOracle | AI Match Predictor",
  description: "Advanced Machine Learning for League of Legends",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Averia+Libre:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Special+Elite&display=swap" rel="stylesheet" />
      </head>
      <body className={`bg-[#010a13] text-white selection:bg-[#00f2ff] selection:text-black`}>
        
        {/* GLOBAL DYNAMIC BACKGROUND */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#010a13]">
          
          {/* Animated Gradient Orbs */}
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#00f2ff]/15 rounded-full blur-[120px] mix-blend-screen animate-blob" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] bg-[#ef4444]/10 rounded-full blur-[150px] mix-blend-screen animate-blob animation-delay-2000" />
          <div className="absolute top-[40%] left-[60%] w-[400px] h-[400px] bg-[#9333ea]/15 rounded-full blur-[100px] mix-blend-screen animate-blob animation-delay-4000" />
          
          {/* Hex-Grid / Tech Grid Overlay */}
          <div 
            className="absolute inset-0 opacity-[0.05]" 
            style={{ 
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
              backgroundPosition: "center center",
            }} 
          >
            {/* Pulsing Grid Scanline Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00f2ff]/5 to-transparent h-[200%] animate-scanline" />
          </div>

          {/* Vignette border to draw eyes to center */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#010a13_80%)]" />
        </div>

        {/* Page Content */}
        <div className="relative z-10 w-full min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}