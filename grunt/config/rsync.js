module.exports = {
	options: {
		// args: ["--verbose"],
		// exclude: [".git*","node_modules"],
		recursive: true
	},
	local_sync: {
		options: {
			src: '<%= local_sync.src %>',		// will be set by local_sync
			dest: '<%= local_sync.dest %>',		// will be set by local_sync
			delete: true
		}
	}
};