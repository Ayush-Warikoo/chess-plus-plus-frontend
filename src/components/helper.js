import { PIECE, WHITE, BLACK } from './constants';

function isPawnPromotion(move, piece) {
    console.log(piece);
    return piece.type === PIECE.pawn
    && ((move.to[1] === '8' && piece.color === WHITE)
    || (move.to[1] === '1' && piece.color === BLACK));
}

export { isPawnPromotion };