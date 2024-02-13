import { PityHistory } from "../types"
import paimon_moe from "./paimon_moe"

const converters: {[key: string]: (history: PityHistory) => Promise<{[key: string]: any}>} = {
	"Paimon.moe": paimon_moe
}

export default converters