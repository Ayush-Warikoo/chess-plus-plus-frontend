const PIECE = {
    pawn: 'p',
    knight: 'n',
    bishop: 'b',
    rook: 'r',
    queen: 'q',
    king: 'k',
};

const WHITE = 'w';
const BLACK = 'b';

const MESSAGE_TYPE = {
    move: 'chess_move',
    undo: 'chess_undo',
    join: 'join_game',
    over: 'game_over',
}

export { PIECE, WHITE, BLACK, MESSAGE_TYPE };