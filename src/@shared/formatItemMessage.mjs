export default (result) => {
	if (result.code === 2) {
		const hashReplaced = result.msg
			.replaceAll('#', ' / ')
			.replaceAll(/ \/ (^\w{1})/g, (letter) => letter.toUpperCase())
			.replaceAll(/\{\{(\S+)\}\}/gi, 'status$1');
		return hashReplaced;
	}

	return result;
};
