import React from "react"; 

export default function Instructions(){
    return (
        <div>
        <h3>Keybinds:</h3>

        There are preset keybinds setup to make it easier to use the tool without having to click around. If done properly a combination of mouse and keyboard actions speed up the annotation process. 
        <br></br><br></br>
        * <kbd>1</kbd> : 行为标记<br></br>
        * <kbd>2</kbd> : 矩形框<br></br>
        * <kbd>4</kbd> : 多边形<br></br>
        * <kbd>a</kbd> : 增加记录<br></br>
        * <kbd>q</kbd> : 后退<br></br>
        * <kbd>s</kbd> : 保存<br></br>
        * <kbd>w</kbd> :暂停/播放<br></br>
        * <kbd>e</kbd> : 前进<br></br>
        * <kbd>c</kbd> : 复制上一图片的标记<br></br>

        <br></br><br></br>
        <h3>Uploading Video:</h3>

        Ensure that you know the framerate, vertical and horizontal resolution of the video chosen to be annotated. These values should be entered into the settings tab into their respective fields. 
        <br></br><br></br>
        Click on the right side browse button. All other buttons on the screen shuold be disabled until the video has been uploaded. Currenntly ```.mp4``` format is the best choice and tested for. 
        <br></br><br></br>
        <h3>Annotations</h3>
        <br></br>
        There are currently three kinds of annotations. 
        <br></br><br></br>
        <h4>Bounding Box:</h4>

        This forms a square around the desired object. There should be small squares at the edges of the bounding box which can be used to resize the box. The number on the top left of the box is used to identify the placement of the box in the table to the right.
        <br></br><br></br>
        <h4>Key Point:</h4>

        This generates an object with multiple points and lines attached to each other. They should be arranged around the obejct where the singular circle with one connecting line is the head and progress to each of the other limbs. 

        ***Note: This feature is currently in development and there will be bugs in using this.***
        <br></br><br></br>
        <h4>Segmentation:</h4>

        Upon generating this each click on the video generates a point which eventually will transform to a set of interconnected points. To complete the polygon click on the original point generated (which is the red colored point)

        ***Note: Unline the Bounding Box, segmentation cant be edited after generated. To fix a mistake remove the annotation and continue from the start.***

        </div>
    )
}