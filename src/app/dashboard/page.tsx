import React from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Card from "@/components/Card";

const DashboardPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100">
        <Header />
        <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card 
            icon="/icons/mic.svg" 
            title="Record or Upload Audio" 
            description="Upload an audio file" 
          />
          <Card 
            icon="/icons/youtube.svg" 
            title="YouTube Video" 
            description="Paste a YouTube link" 
          />
          <Card 
            icon="/icons/pdf.svg" 
            title="PDF Upload" 
            description="Upload a PDF file" 
          />
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
