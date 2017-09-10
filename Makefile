MOCHA_OPTS= -t 20000

install:
	rm -rf node_modules
	npm update
	
test:
	./node_modules/.bin/mocha \
		--require should \
		--reporter list \
		$(MOCHA_OPTS) \
		test/unit-tests/*

integration-test:
	./node_modules/.bin/mocha \
		--require should \
		--reporter list \
		$(MOCHA_OPTS) \
		test/integration-tests/test-*

.PHONY: test