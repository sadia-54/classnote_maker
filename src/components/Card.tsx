import React from "react";
import { SvgIconComponent } from "@mui/icons-material";

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Card: React.FC<CardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-gray-700 shadow rounded-lg p-4 flex items-center mt-7">
        
    <div className="w-10 h-10 mr-4 text-red-400">{icon}</div>
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default Card;
