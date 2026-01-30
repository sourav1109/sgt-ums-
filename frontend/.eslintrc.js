module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Warn on console.log (allow console.warn, console.error for debugging)
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    
    // Prevent direct axios imports outside lib/api.ts
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'axios',
            message: 'Please use @/lib/api instead of importing axios directly.',
          },
        ],
        patterns: [
          {
            group: ['axios/*'],
            message: 'Please use @/lib/api instead of importing axios directly.',
          },
        ],
      },
    ],
    
    // Prefer const over let
    'prefer-const': 'warn',
  },
  overrides: [
    // Allow axios import in lib/api.ts
    {
      files: ['src/lib/api.ts'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
    // Allow console.log in scripts and utilities
    {
      files: ['scripts/**/*', 'src/utils/**/*'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
}
