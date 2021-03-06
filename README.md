# Lendable

[![Lendable CI](https://github.com/jpetrich/lendable/actions/workflows/lendable-ci.yml/badge.svg?branch=main)](https://github.com/jpetrich/lendable/actions/workflows/lendable-ci.yml)

This is a demonstration repository for a proposed new contract standard for lendable tokens called ERC721Lendable. It extends the ERC721 contract adding the ability to retain admin-ownership over tokens while allowing other addresses to freely use and transfer those tokens according to the existing ERC721 specification. This is intended to be useful for lending NFTs without requiring collateral. Since the lender can transfer the token at will, the borrower is disincentivized from misusing the token (by, e.g. selling it, or not fulfilling the requirements of some off-chain contract).

The test suite in ERCLendable.test.js demonstrates the basic functionality. Before attempting to make this contract a standard, the following behavior should be considered:

* A method to retrieve the balance of a given lender, even of tokens not currently in the lender's wallet

Many thanks to [@GregJessner](https://twitter.com/GregJessner) of [Narval](https://narval.xyz) who inspired this idea.
