# Contributing

Small, focused fixes are welcome. For a new tool, describe the workflow and why it belongs in Zipizy before starting a large change.

1. Create a branch for the change.
2. Keep file processing on the user's device. Document any network requests.
3. Add regression coverage for logic changes.
4. Run `npm test` and `npm run build`.
5. Check keyboard operation, mobile layout and a realistic invalid input.

Do not commit user documents, credentials, `.env` files, build output or installer binaries. Do not remove third-party copyright notices. Comments should explain decisions or non-obvious constraints rather than repeat the code.
