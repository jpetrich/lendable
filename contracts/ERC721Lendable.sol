// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ERC721Lendable is ERC721 {
    // Mapping from token ID to lending-authorized address (initial owner)
    mapping(uint256 => address) private _lenders;

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {}

    /**
     * @dev Returns whether `spender` is the lender of `tokenId` or whether `spender` is approved to manage `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view virtual override returns (bool) {
        return (super._isApprovedOrOwner(spender, tokenId) || _lenders[tokenId] == spender);
    }

    /**
    * @dev Mints a token to the specified address, initially setting the lender
    to the `to` address for `tokenId`
     */
    function _mint(address to, uint256 tokenId) internal virtual override {
        super._mint(to, tokenId);
        _lenders[tokenId] = to;
    }

    function transferLenderRecordFrom(address from, address to, uint256 tokenId) public {
        require(_lenders[tokenId] == from, 'Token is not registered to the specified lender');
        require(msg.sender == from, 'Sender is not the specified lender');
        _lenders[tokenId] = to;
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721) returns (bool) {
        return
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC721Metadata).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}