export const GRADIENTS = {
    // Primary brand gradient
    PRIMARY: "linear-gradient(90deg, #12DBE5 0%, #1F5799 48.96%, #F20000 100%)",
    
    // Hover state variations
    PRIMARY_HOVER: "linear-gradient(90deg, #0FC8D1 0%, #1A4A87 48.96%, #D90000 100%)",
    PRIMARY_ACTIVE: "linear-gradient(90deg, #0DB5BD 0%, #183F75 48.96%, #C10000 100%)",
    
    // Direction variations
    PRIMARY_45: "linear-gradient(45deg, #12DBE5 0%, #1F5799 48.96%, #F20000 100%)",
    PRIMARY_135: "linear-gradient(135deg, #12DBE5 0%, #1F5799 48.96%, #F20000 100%)",
    
    // Text versions (for gradient text)
    PRIMARY_TEXT: "bg-gradient-to-r from-[#12DBE5] via-[#1F5799] to-[#F20000]",
    
    // Border versions
    PRIMARY_BORDER: "bg-gradient-to-r from-[#12DBE5] via-[#1F5799] to-[#F20000]",
  } as const;
  
  export const GRADIENT_CLASSES = {
    // For background gradients
    BG_PRIMARY: "bg-gradient-to-r from-[#12DBE5] via-[#1F5799] to-[#F20000]",
    BG_PRIMARY_HOVER: "hover:bg-gradient-to-r hover:from-[#0FC8D1] hover:via-[#1A4A87] hover:to-[#D90000]",
    
    // For text gradients
    TEXT_PRIMARY: "bg-gradient-to-r from-[#12DBE5] via-[#1F5799] to-[#F20000] bg-clip-text text-transparent",
    
    // For borders
    BORDER_PRIMARY: "border-gradient-to-r from-[#12DBE5] via-[#1F5799] to-[#F20000]",
  } as const;