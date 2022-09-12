function isPromotion(move, game) {
    return (move.to[1] === '8' && game.turn() === 'w')
    || (move.to[1] === '1' && game.turn() === 'b');
}

export { isPromotion };