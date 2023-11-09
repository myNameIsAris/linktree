const validate = (schema, req) => {
	const result = schema.validate(req)

	return [result.value, result.error]

	// if (result.error) throw result.error

	// return result.value
}

module.exports = {
	validate,
}
