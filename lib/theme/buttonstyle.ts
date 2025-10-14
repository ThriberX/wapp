import { GRADIENTS } from "@/lib/theme/colours";

export const buttonStyles = {
  base: "inline-flex items-center justify-center text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 text-lg sm:text-xl relative overflow-hidden group hover:scale-105 active:scale-95",
  ripple: "absolute inset-0 bg-white/20 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-500 opacity-0 group-hover:opacity-100"
};

export const buttonHandlers = {
  onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.background = GRADIENTS.PRIMARY_HOVER;
  },
  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.background = GRADIENTS.PRIMARY;
  },
  onClick: (e: React.MouseEvent<HTMLElement>) => {
    const button = e.currentTarget;
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 150);
  }
};