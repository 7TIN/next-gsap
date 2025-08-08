

# Scroll-Based Video Animation with GSAP & Next.js

This project demonstrates how to create a cinematic, scroll-driven animation using a sequence of image frames, powered by GSAP's ScrollTrigger in a Next.js application.



## Getting Started

Follow these steps to get the project running on your local machine.

### 1. Clone the Repository

Clone this project to your local machine using git.

```bash
git clone https://github.com/7TIN/next-gsap.git
```

### 2. Install Dependencies & Run

Navigate into the project directory and install the required npm packages.

```bash
cd next-gsap
pnpm install or npm install
pnpm run dev or npm run dev
```

Open [http://localhost:3000] in your browser to see the running application.


## Creating & Using Your Own Image Frames

The animation is powered by a sequence of images (frames) extracted from a video. Here’s how to create your own.

### Step 1: Create the Image Frames from a Video

### 1. Using a Video Editor

If you use a video editor like Adobe Premiere Pro, DaVinci Resolve, or Final Cut Pro, you can typically use the "Export Frames" or "Image Sequence" option in the export settings.

Make sure your export format is PNG.
Set the filename pattern to be sequential, like frame_00001.png, frame_00002.png, etc.

### 2. Using FFMPEG (Command-Line)

FFMPEG is a powerful free tool for this task. After installing it on your system, run the following command in your terminal:

```Bash

ffmpeg -i my-video.mp4 -vf "fps=30" path/to/your-project/public/frames/frame-%05d.png
```
- -i my-video.mp4: Your input video file.

- -vf "fps=30": Sets the output to 30 frames per second.

The final path tells FFMPEG to directly create a frames folder inside your project's public directory and save the images there.



### Step 2: Use the Frames in the Code

1.  **Move the Frames:** Take the entire `frames` folder you just created and place it inside the **`/public`** directory of your Next.js project. The final path should be `/public/frames/`.

2.  **Update the Component:** Open the `AnimatedHero.tsx` component and check these two things:

      * **`frameCount`:** Make sure this variable matches the total number of images you generated.
        ```javascript
        const frameCount = 240; // Change this to your total frame count
        ```
      * **`currentFrame` Function:** This function generates the path for each image. If your file naming is different from the FFMPEG command above, you **must** update this function to match your filenames exactly.
        ```javascript
        const currentFrame = (index: number) =>
          // This path must match your files in the /public/frames folder
          `/frames/frame-${String(index + 1).padStart(5, "0")}.png`;
        ```