import React from "react";

interface CardProps {
  icon: string;
  title: string;
  description: string;
}

const Card: React.FC<CardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex items-center">
      <img src={icon} alt="" className="w-10 h-10 mr-4" />
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default Card;
