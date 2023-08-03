export default class {
	constructor(redis, key) {
		this.client = redis;
		this.key = key;
	}

	extract(documents) {
		return documents.map((d) => ({...d.value}))
	}

	async getItems(input) {
		const queryOptions = {
			INORDER: true,
			SCORER: 'TFIDF.DOCNORM'
		};

		const splittedString = input.split(' ');
		const fuzzyInput = splittedString.map((s) => `%${s}%`).join();

		console.log(`Fazendo fuzzy matching para a chave: '${this.key}:${input}'`);
		const fuzzyMatching = await this.client.ft.search(
			this.key,
			fuzzyInput,
			queryOptions
		);

		if (fuzzyMatching.total > 0) {
			return this.extract(fuzzyMatching.documents);
		}
		
		console.warn('Fuzzy matching falhou...');
		console.log(`Fazendo pattern matching para a chave: '${this.key}:${input}'`);
		const patternInput = fuzzyInput.replaceAll('%', '*');
		const patternMatching = await this.client.ft.search(
			this.key,
			patternInput,
			queryOptions
		);

		return this.extract(patternMatching.documents);
	}
}
