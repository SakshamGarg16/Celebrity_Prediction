import numpy as np
import pywt
import cv2 as cv
def wavelet(imagee,mode='haar',level=1):
    arrays = imagee

    arrays = cv.cvtColor(arrays,cv.COLOR_RGB2GRAY)
    arrays = np.float32(arrays)
    arrays/=255
    coeff =  pywt.wavedec2(arrays,mode,level)
    
    coeff_H = list(coeff)
    coeff_H[0] *=0
    
    arrays_H = pywt.waverec2(coeff_H,mode)
    arrays_H *=255
    arrays_H = np.uint8(arrays_H)
    
    return arrays_H    