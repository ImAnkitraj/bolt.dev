import { BASE_PROMPT, getSystemPrompt } from "./prompts";
require("dotenv").config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
import { basePrompt as reactBasePrompt } from "./defaults/react";
import { basePrompt as nodeBasePrompt } from "./defaults/node";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const app = express();

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  // systemInstruction: getSystemPrompt(),
});

app.use(express.json());

app.post("/template", async (req, res) => {
  const prompt = req.body.prompt;
  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    systemInstruction:
      "Return Either node or react based on what do you think this project should be. Only return a single word wither 'react' or 'node'. Do not return both or anything else.",
  });

  const answer = result?.response?.text().trim();
  if (answer == "react") {
    res.json({
      prompts: [
        BASE_PROMPT,
        `# Project Files\n\nThe following is a list of all project files and their complete contents that are currently visible and accessible to you.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n - package-lock.json`,
      ],
      uiPrompt: [reactBasePrompt],
    });
    return;
  }
  if (answer == "node") {
    res.json({
      prompts: [
        `# Project Files\n\nThe following is a list of all project files and their complete contents that are currently visible and accessible to you.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n - package-lock.json`,
      ],
      uiPrompt: [nodeBasePrompt],
    });
    return;
  }
  res.status(403).json({
    message: "Invalid response. Please try again.",
  });
});

app.post("/chat", async (req, res) => {
  const messages = req.body.messages;
  const result = await model.generateContent({
    contents: messages,
    systemInstruction: getSystemPrompt(),
  });
  console.log(result.response.text());
});

app.listen(3000, () => console.log("Server started at 3000"));

// const funStream = async () => {
//   const result = await model.generateContentStream({
//     contents: [
//       {
//         role: "user",
//         parts: [
//           {
//             text: "# Project Files\n\nThe following is a list of all project files and their complete contents that are currently visible and accessible to you.\n\n{{BASE_PROMPT}}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - .bolt/prompt\n  - .bolt/config.json\n  - package-lock.json",
//           },
//         ],
//       },
//       {
//         role: "user",
//         parts: [
//           {
//             text: "For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\nBy default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.\n\nUse icons from lucide-react for logos.\n\nUse stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.",
//           },
//         ],
//       },
//       {
//         role: "user",
//         parts: [
//           {
//             text: "create a next js todo app",
//           },
//         ],
//       },
//       {
//         role: "user",
//         parts: [
//           {
//             text: "<bolt_running_commands>\n</bolt_running_commands>\n\ncreat a todo app\n\n# File Changes\n\nHere is a list of all files that have been modified since the start of the conversation.\nThis information serves as the true contents of these files!\n\nThe contents include either the full file contents or a diff (when changes are smaller and localized).\n\nUse it to:\n - Understand the latest file modifications\n - Ensure your suggestions build upon the most recent version of the files\n - Make informed decisions about changes\n - Ensure suggestions are compatible with existing code\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - /home/project/.bolt/config.json",
//           },
//         ],
//       },
//     ],
//     // generationConfig: {
//     //   maxOutputTokens: 1000,
//     //   temperature: 0.1,
//     // },
//   });
//   for await (const chunk of result.stream) {
//     const chunkText = chunk.text();
//     process.stdout.write(chunkText);
//   }
// };

// funStream();
