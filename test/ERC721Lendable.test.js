describe("ERC721Lendable Test Suite", function() {

    const chai = require('chai');
    const chaiAsPromised = require('chai-as-promised');
    const expect = chai.expect;
    chai.use(chaiAsPromised);
    const { ethers } = require('hardhat');

    before(async function() {
        
        this.signers = await ethers.getSigners();
        this.deployer = this.signers[0];
        this.lender = this.signers[1];
        this.borrower = this.signers[2];
        this.thirdParty = this.signers[3];
        this.tokenId = 1;
        this.erc721MockFactory = await ethers.getContractFactory('ERC721Mock', this.deployer);
    });

    beforeEach(async function() {
        this.ERC721Mock = await this.erc721MockFactory.deploy('ERC721Mock', 'MOCK');
    });

    describe("ERC721Lendable basic lending test suite", function() {
        it("should be able to mint an ERC721 token", async function() {
            // Mint to the lender
            await this.ERC721Mock.connect(this.deployer).mint(this.lender.address, this.tokenId);
            let balance = await this.ERC721Mock.balanceOf(this.lender.address);
            await expect(balance.toNumber()).to.equal(1);
        });

        it("should be able to transfer an ERC721 token", async function() {
            // Mint to the lender
            await this.ERC721Mock.connect(this.deployer).mint(this.lender.address, this.tokenId);
            // Transfer from lender to borrower
            await this.ERC721Mock.connect(this.lender).transferFrom(this.lender.address, this.borrower.address, this.tokenId);
            let balance = await this.ERC721Mock.balanceOf(this.borrower.address);
            await expect(balance.toNumber()).to.equal(1);
        });

        it("should be able to transfer an ERC721 token as the lender even if the lender is not the current owner", async function() {
            // Mint to the lender
            await this.ERC721Mock.connect(this.deployer).mint(this.lender.address, this.tokenId);
            // Transfer from lender to borrower
            await this.ERC721Mock.connect(this.lender).transferFrom(this.lender.address, this.borrower.address, this.tokenId);

            // As the lender, transfer the token back to yourself from the borrower
            await this.ERC721Mock.connect(this.lender).transferFrom(this.borrower.address, this.lender.address, this.tokenId);
            let balance = await this.ERC721Mock.balanceOf(this.lender.address);
            await expect(balance.toNumber()).to.equal(1);
        });

        it("should be able to transfer an ERC721 token as the current borrower back to the lender", async function() {
            // Mint to the lender
            await this.ERC721Mock.connect(this.deployer).mint(this.lender.address, this.tokenId);
            // Transfer from lender to borrower
            await this.ERC721Mock.connect(this.lender).transferFrom(this.lender.address, this.borrower.address, this.tokenId);

            // Transfer the token back to the lender from the borrower
            await this.ERC721Mock.connect(this.borrower).transferFrom(this.borrower.address, this.lender.address, this.tokenId);
            let balance = await this.ERC721Mock.balanceOf(this.lender.address);
            await expect(balance.toNumber()).to.equal(1);
        });

        it("should not be able to transfer an ERC721 token as the current borrower to a third party", async function() {
            // Mint to the lender
            await this.ERC721Mock.connect(this.deployer).mint(this.lender.address, this.tokenId);
            // Transfer from lender to borrower
            await this.ERC721Mock.connect(this.lender).transferFrom(this.lender.address, this.borrower.address, this.tokenId);

            // As the borrower, attempt to transfer the token to a third party
            await expect( this.ERC721Mock.connect(this.borrower).transferFrom(this.borrower.address, this.thirdParty.address, this.tokenId)).to.be.rejectedWith('Transfer of a borrowed token except to the lender is not allowed.');
        });

        it("should not be possible to transfer an ERC721 token if not the owner or lender", async function() {
            // Mint to the lender
            await this.ERC721Mock.connect(this.deployer).mint(this.lender.address, this.tokenId);
            // Transfer from lender to borrower
            await this.ERC721Mock.connect(this.lender).transferFrom(this.lender.address, this.borrower.address, this.tokenId);

            await expect(this.ERC721Mock.connect(this.thirdParty).transferFrom(this.borrower.address, this.thirdParty.address, this.tokenId)).to.be.rejectedWith('Transfer of a borrowed token except to the lender is not allowed.');
        });

        it("should be able to transfer owner and lender role of an ERC721 token as the current lender", async function() {
            // Mint to the lender
            await this.ERC721Mock.connect(this.deployer).mint(this.lender.address, this.tokenId);
            // Transfer from lender to borrower
            await this.ERC721Mock.connect(this.lender).transferWithFullRightsFrom(this.lender.address, this.thirdParty.address, this.tokenId);
            let balance = await this.ERC721Mock.balanceOf(this.thirdParty.address);
            await expect(balance.toNumber()).to.equal(1);
            let tokenLenderAddress = await this.ERC721Mock.lenderOf(this.tokenId);
            await expect(tokenLenderAddress).to.equal(this.thirdParty.address);
        });
    })
});