import { PityHistory, PityHistoryEntry } from "../types";

interface PaimonMoeHistoryEntry {
	type: "weapon" | "character"
	code: "100" | "200" | "300" | "301" | "302" | "400"
	id: string
	time: string
	pity: number
}

interface PaimonMoeBanner {
	total: number
	legendary: number
	rare: number
	pulls: PaimonMoeHistoryEntry[]
}

interface PaimonMoeHistory {
	"server": GenshinServer
	"wish-counter-setting": {
		firstTime: boolean
		manualInput: boolean
	}
	"wish-counter-character-event"?: PaimonMoeBanner
	"wish-counter-weapon-event"?: PaimonMoeBanner
	"wish-counter-standard"?: PaimonMoeBanner
	"wish-uid": string
}

enum GenshinServer {
	"America" = "America",
	"Europe" = "Europe",
	"China" = "China",
	"Asia/TW/HK/MO" = "Asia"
}

function getFilteredHistory(history: PityHistoryEntry[]): PaimonMoeBanner {
	const banner: PaimonMoeBanner = {
		total: history.length,
		legendary: 0,
		rare: 0,
		pulls: []
	}

	//let fiveStarPity = 0
	//let fourStarPity = 0

	for (const wish of history) {
		// Increment pity
		banner.rare++
		banner.legendary++

		// Create default pull object
		const pull: PaimonMoeHistoryEntry = {
			type: wish.item_type.toLowerCase() as "weapon",
			id: wish.name.toLowerCase().replaceAll(" ", "_").replaceAll("'", ""),
			time: wish.time,
			code: wish.gacha_type,
			pity: 1
		}

		// Check for 4- and 5-star pulls and change values accordingly
		switch (wish.rank_type) {
			case "4":
				// banner.rare++
				pull.pity = banner.rare
				banner.rare = 0
				break
			case "5":
				// banner.legendary++
				pull.pity = banner.legendary
				banner.legendary = 0
				break;
		}

		// Add the modified pull to the pulls
		banner.pulls.push(pull)
	}

	return banner
}

export default async function (history: PityHistory): Promise<{[key: string]: any}> {
	// Create an object and add some default settings
	const finalHistory: PaimonMoeHistory = {
		server: GenshinServer["Asia/TW/HK/MO"],
		"wish-counter-setting": {
			firstTime: true,
			manualInput: false
		},
		"wish-uid": history.uid
	}

	// Get proper server (the rest are Asia)
	if (history.uid) {
		const startingDigit = history.uid.charAt(0)
		switch (startingDigit) {
			case "6":
				finalHistory.server = GenshinServer.America
				break;
			case "7":
				finalHistory.server = GenshinServer.Europe
				break;
		}
	}

	// Sort from earliest to latest
	const sortedHistory = history.history?.sort((a, b) => (a.time > b.time) ? 1 : -1)

	// Filter banner wishes
	const eventWishes = sortedHistory.filter(e => e.gacha_type === "400" || e.gacha_type === "301")
	const weaponWishes = sortedHistory.filter(e => e.gacha_type === "300" || e.gacha_type === "302")
	const standardWishes = sortedHistory.filter(e => e.gacha_type === "200")

	// Set the banner wishes
	if (eventWishes.length) finalHistory["wish-counter-character-event"] = getFilteredHistory(eventWishes)
	if (weaponWishes.length) finalHistory["wish-counter-weapon-event"] = getFilteredHistory(weaponWishes)
	if (standardWishes.length) finalHistory["wish-counter-standard"] = getFilteredHistory(standardWishes)

	// Return the final object
	return finalHistory
}