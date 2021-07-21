import HypixelAPI from 'hypixel-api-reborn';

export const RespondToInteraction = (client : any, interaction : any, data : any, type : number = 4) => {
	client.api.interactions(interaction.id, interaction.token).callback.post({data: {
		type: type,
		data: data
	}})
}

export const GetHypixelApi = () => {
	return new HypixelAPI.Client(process.env.HYPIXEL_TOKEN ?? "");
}