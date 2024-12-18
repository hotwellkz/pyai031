import { Star } from 'lucide-react';

interface ReviewCardProps {
  name: string;
  date: string;
  rating: number;
  text: string;
  role: string;
}

export default function ReviewCard({ name, date, rating, text, role }: ReviewCardProps) {
  return (
    <div className="flex-none w-[300px] md:w-[400px] p-6 bg-white rounded-xl shadow-md mx-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-900">{name}</h3>
          <p className="text-sm text-slate-500">{role}</p>
        </div>
        <span className="text-sm text-slate-500">{date}</span>
      </div>
      
      <div className="flex mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      
      <p className="text-slate-600">{text}</p>
    </div>
  );
}