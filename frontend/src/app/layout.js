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
      <body className={`bg-[#050505] text-white selection:bg-[#e60000] selection:text-white`}>
        
        {/* GLOBAL DYNAMIC BACKGROUND — Monochrome + Red (matches landing page) */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#050505]">
          
          {/* Subtle Ambient Orbs (B&W + Red) */}
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] mix-blend-screen animate-blob" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] bg-[#e60000]/8 rounded-full blur-[150px] mix-blend-screen animate-blob animation-delay-2000" />
          <div className="absolute top-[40%] left-[60%] w-[400px] h-[400px] bg-white/3 rounded-full blur-[100px] mix-blend-screen animate-blob animation-delay-4000" />
          
          {/* Neural Grid Overlay */}
          <div 
            className="absolute inset-0 opacity-[0.04]" 
            style={{ 
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
              backgroundPosition: "center center",
              maskImage: "radial-gradient(circle at center, black 40%, transparent 80%)",
              WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 80%)",
            }} 
          />

          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_80%)]" />
        </div>

        {/* Page Content */}
        <div className="relative z-10 w-full min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}