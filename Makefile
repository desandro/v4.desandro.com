deploy: build
	s3cmd -c ~/.s3cfg-desandro sync --cf-invalidate build/. s3://desandro.com
