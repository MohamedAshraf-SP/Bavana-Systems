
import crypto from 'crypto';


export const generateID = () => {
    return "SYS" + Math.floor(Math.random() * 1010018010)
}

export const generateBarcode = () => {
    return "BR" + Date.now().toString(36).slice(0, 4) + Math.random().toString(36).slice(5, 6).toUpperCase();
};
