// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";
import '@openzeppelin/contracts/metatx/ERC2771Context.sol';

contract GameContract is AccessControl, ERC2771Context {
    bytes32 public immutable OPRATOR;
    uint256 public totalPlayers;

    struct Game {
        uint256 currentPlayers;
        bool gameOngoing;
    }

    mapping(uint256 => Game) public games;
    mapping(uint256 => mapping(address => bool)) public isPlayer;
    mapping(uint256 => mapping(address => uint256)) public scores;
      /**
   * @dev Constructor for Game contract
   */
    constructor(uint256 _totalPlayers, address _minimalForwarder) ERC2771Context(_minimalForwarder){
        totalPlayers = _totalPlayers;
        OPRATOR = keccak256("OPRATOR");
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    /**
     @dev modifier to check if the sender is the default admin of ADMN contract
     * Revert if the sender is not the admin
     */
    modifier onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "ADMN: Only Admin");
        _;
    }

    /**
     @dev modifier to check if the sender is the trusted forwarder
     * Revert if the sender is not the trusted forwarder
     */
    modifier onlyTrustedForwarder() {
        require(isTrustedForwarder(msg.sender), "NNF: Only Trusted Forwarder");
        _;
    }

    /**
     @dev Overriding _msgSender function inherited from Context and ERC2771Context
     */
    function _msgSender()
        internal
        view
        virtual
        override(Context, ERC2771Context)
        returns (address)
    {
        return ERC2771Context._msgSender();
    }

    /**
     @dev Overriding _msgData function inherited from Context and ERC2771Context
     */
    function _msgData()
        internal
        view
        virtual
        override(Context, ERC2771Context)
        returns (bytes calldata)
    {
        return ERC2771Context._msgData();
    }

     /**
     @dev Function for creating a new Game/Tournament
     * Reverts if the caller is not the Admin of the contract
     * @param gameId The unique id for each game
     */
    function createGame(uint256 gameId) external onlyAdmin {
        games[gameId] = Game(0, false);
    }

    /**
     @dev Function for allowing a user to enter the game
     * Reverts if the caller is not forwarder contract
     * Reverts if User is already a player
     * Reverts if Total capacity of the game is Filled
     * Reverts if Game has already started
     * @param gameId The unique id for each game
     * @param _player The wallet Address of the user who wants to join the Game
     */
    function enterGame(uint256 gameId, address _player) external onlyTrustedForwarder {
        require(isPlayer[gameId][_player] == false, "Already a player");
        require(
            games[gameId].currentPlayers + 1 <= totalPlayers,
            "We have filled our total capacity"
        );
        require(games[gameId].gameOngoing == false, "Game has already started");
        games[gameId].currentPlayers += 1;
        isPlayer[gameId][_player] = true;
        if (games[gameId].currentPlayers == totalPlayers) {
            games[gameId].gameOngoing = true;
        }
    }

    /**
     @dev Function for allowing a user to addScore for a game
     * Reverts if the caller is not forwarder contract
     * Reverts if Game is not in Going on
     * Reverts if User has not registered as player
     * @param gameId The unique id for each game
     * @param _score Score of the player
     * @param _player The wallet Address of the player
     */
    function addScore(uint256 gameId, uint256 _score, address _player ) external onlyTrustedForwarder {
        require(games[gameId].gameOngoing == true, "Game has not started yet");
        require(isPlayer[gameId][_player] == true, "not a player");
        scores[gameId][_player] = _score;
    }

    /**
     @dev Public Function for get score of a player for a Game
     * Reverts if User has not registered as player
     * @param gameId The unique id for each game
     * @param _player The wallet Address of the player
     */
    function getScore(uint256 gameId, address _player)
        public
        view
        returns (uint256)
    {
        require(isPlayer[gameId][_player] == true, "not a player");
        return scores[gameId][_player];
    }

    /**
     @dev Function for end a Game/Tournament
     * Reverts if the caller is not the Admin of the contract
     * Reverts if Game has already ended
     * @param gameId The unique id for each game
     */
    function endGame(uint256 gameId) external onlyAdmin {
        require(games[gameId].gameOngoing == true, "Game is already ended");
        games[gameId].gameOngoing = false;
    }
}
