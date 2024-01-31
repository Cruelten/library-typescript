// eslint-disable-next-line no-unused-vars 
import express from 'express'; 

declare global { 
  // eslint-disable-next-line no-unused-vars 
  namespace Express { 
    // eslint-disable-next-line no-unused-vars 
    interface Request { 
      file: Record<string, string>; 
    } 
  } 
} 