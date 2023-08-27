module.exports = {
	'root': true,
	'env': {
		'browser': true,
		'es2020': true
	},
	'extends': [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'plugin:react-hooks/recommended',
	],
	'ignorePatterns': ['dist', '.eslintrc.cjs'],
	'overrides': [
		{
			'env': {
				'node': true
			},
			'files': [
				'.eslintrc.{js,cjs}'
			],
			'parserOptions': {
				'sourceType': 'script'
			}
		}
	],
	'parserOptions': {
		'ecmaVersion': 'latest',
		'sourceType': 'module'
	},
  'settings': { react: { version: '18.2' } },
	'plugins': [
		'react',
    'react-refresh'
	],
	'rules': {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		],
    'react/prop-types': 'off',
	}
}
