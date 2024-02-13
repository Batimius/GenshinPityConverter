# Genshin Impact Pity Converter
A simple website for converting your Genshin Impact wish history from HotGames.GG to other platforms.

## Instructions

### Step 1
1. Go to <https://genshin.hotgames.gg/wish-counter>
2. Make sure you are either signed in or you have imported your history
3. Open your console window (`Ctrl + Shift + J` [Windows], `Cmd + Shift + J` [Mac] for __Chrome__ / __Edge__, `Ctrl + Shift + K` [Windows], `Cmd + Shift + K` [Mac] for __Firefox__)
4. Paste the following command and hit enter:
 ```js
const url = "https://data.mongodb-api.com/app/game-data-kkvxs/endpoint/genshin_wish_history?action=load&sweUid="
const uid = localStorage.getItem("sweUid")

if (!uid) alert("No UID found. Are you signed in?")
else this.document.location = url + uid
```
5. Either copy the JSON and save it in a file or copy the URL of the window
### Step 2
Go to https://batimius.github.io/GenshinPityConverter, import your history by either using the URL or by uploading the JSON file, and follow the steps until you export your history to the JSON format of your desired service.
### Step 3
Go to whichever service you chose to export your history to and import the JSON file.
##### __NOTE__: The tool makes a simple conversion from one service to another. It is recommended that you do a native history import right after importing as well in order to avoid any compatibility issues.

## Q&A

#### Can I create my own converter?
Absolutely! If you look in the `src/converters` directory, you will see that each converter is a separate `.ts` file. Simply create your own, import it to `converter.ts`, and open a pull request. The format for the converter is the following:
```tsx
import { PityHistory } from "../types";

export default async function (history: PityHistory): Promise<{[key: string]: any}> {
	// Your conversion logic goes here
	// The function takes in the history as PityHistory and expects
	//       an object in return (the JSON object for your service)
}
```

#### Why is the code so badly written?
I am new to React. The constant refreshing of child elements makes everything very confusing, so I did my best to create a tool so people could use. I didn't really care much about making it clean or pretty. There is **a lot** of room for improvement. I might improve it in the future. If someone wishes to rewrite parts of it (or all of it), be my guest.

#### It isn't working. Where can I get help?
If this is a general question or problem, please utilize the [Discussions](https://github.com/Batimius/GenshinPityConverter/discussions) page and create a post there. If you are confident that this is an issue with the converter, feel free to open up a new [Issue](https://github.com/Batimius/GenshinPityConverter/issues).

#### How can I contact you?
I don't know why you'd need to directly contact me (I recommend you utilize the Issue and Discussions pages), but if you need to get in touch, you can contact me through Discord (@batimius) or X (@Batimius).