import base64
import joblib
import json
import cv2 as cv
import numpy as np
from wavelet import wavelet
from matplotlib import pyplot as plt



__model = None
__num_name_dist={}
__name_num_dist={}

def classify_image(base64_str,File_path=None):
    if File_path:
        image = cv.imread(File_path)
    else:
        image = converter(base64_str)
        
    img = get_2_eyes_image(image)
    
    result=[]
    for imagee in img:
        scalled_raw_img = cv.resize(imagee,(32,32))
        img_har = wavelet(imagee,'db1',5)
        scalled_har = cv.resize(img_har,(32,32))
        resultant = np.vstack((scalled_raw_img.reshape(32*32*3,1),scalled_har.reshape(32*32,1)))
        
        final_resultant = resultant.reshape(1,4096).astype(float)
        result.append({
            'class': __num_name_dist[__model.predict(final_resultant)[0]],
            'class_probability': np.around(__model.predict_proba(final_resultant)*100,2).tolist()[0],
            'class_dictionary': __name_num_dist
        })
    return result
    
    
        
def get_2_eyes_image(image):
    face_cascade = cv.CascadeClassifier('../model\opencv\haarcascades\haarcascade_frontalface_default.xml')
    eye_cascade = cv.CascadeClassifier('../model\opencv\haarcascades\haarcascade_eye.xml')
    
    gray_image = cv.cvtColor(image,cv.COLOR_RGB2GRAY)
    faces = face_cascade.detectMultiScale(gray_image,1.3,5)
    result = []
    for (x,y,w,h) in faces:
        roi_color = image[y:y+h,x:x+w]
        roi_gray = gray_image[y:y+h,x:x+w]
        eye = eye_cascade.detectMultiScale(roi_gray)
        if len(eye)>1:
            result.append(roi_color)
            
    return result
    
        
def converter(b64str):
    encoded_data = b64str.split(',')[1]
    nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
    img = cv.imdecode(nparr, cv.IMREAD_COLOR)    
    return img
    

def get_b64_img():
    with open(r'.\Base64img.txt','r') as f:
        return f.read() 


def retrievefiles():
    global __model
    with open(r'./artifact/face_recog_joblib.pkl','rb') as f:
        __model = joblib.load(f)
        
    global __name_num_dist
    global __num_name_dist
    with open(r'./artifact/class_dist.json','r') as f:
        __name_num_dist = json.load(f)
        __num_name_dist = {v:k for k,v in __name_num_dist.items()}
        
    print("load complete")
    

if __name__ == '__main__':
    retrievefiles()
    # print(classify_image(get_b64_img(),None))
    print(classify_image(None,r"D:\Python\Project2\backend\model\images_dataset\virat_kohli\1fee075645.jpg"))