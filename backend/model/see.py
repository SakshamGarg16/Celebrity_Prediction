import pickle
import cv2 as cv


with open(r'face_recog_model.pickle','rb') as file:
    data = pickle.load(file)
img = cv.imread(r'images_dataset\cropped_img\serena_williams\serena_williams_37.png')
img =  cv.cvtColor(img,cv.COLOR_BGR2GRAY)
print(data.predict(img))