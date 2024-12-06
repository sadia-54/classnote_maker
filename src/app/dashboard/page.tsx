import React from "react";
import MicIcon from "@mui/icons-material/Mic";
import YouTubeIcon from "@mui/icons-material/YouTube";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Card from "@/components/Card";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-900 h-screen">
        <Header />
        <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card 
            icon={ <MicIcon/> }
            title="Record or Upload Audio" 
            description="Upload an audio file" 
          />
          <Card 
            icon={ <YouTubeIcon/> }
            title="YouTube Video" 
            description="Paste a YouTube link" 
          />
          <Card 
             icon={ <PictureAsPdfIcon/> }
            title="PDF Upload" 
            description="Upload a PDF file" 
          />
        </section>
        <section className="mt-10 text-red-300">
           <h1 className="font-bold text-2xl">All Notes</h1> 
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
