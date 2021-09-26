class RivetBridgeStub {
	static init () {
		window.addEventListener("rivet.receive", evt => {
			console.log(`Received Rivet message (JSON)`);
			return this._handlePacket(evt.detail);
		});

		window.addEventListener("rivet.receive-text", () => {
			console.log(`Received Rivet message (text)`);
			const $ipts = $(`textarea.rivet-transfer`);
			const packetRaw = $ipts.last().val();
			$ipts.remove();
			return this._handlePacket(JSON.parse(packetRaw));
		});
	}

	static _handlePacket (pack) {
		if (pack.type !== "roll") return
		this._handleRollMessage(pack);
	}

	static _handleRollMessage (pack) {
		const data = pack.data;

		if (!pack.settings.isSendRolls) return;

		const roll = new Roll(data.dice);

		const whisper = [];
		if (pack.settings.isWhisper) whisper.push(game.userId);

		roll.toMessage({
			speaker: {
				alias: data.rolledBy,
			},
			flavor: data.label,
			rollMode: "roll",
			whisper,
		});
	}
}

Hooks.on("ready", () => {
	RivetBridgeStub.init();
});
