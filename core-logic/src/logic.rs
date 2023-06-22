pub enum SequenceType {
    HIT,
    DRAW,
    PUNCH,
    BEND,
    UPSET,
    SHRINK,
}

// like SequenceType, but separates the different hit types
pub enum SequenceUniqueType {
    HIT_1 = -3,
    HIT_2 = -6,
    HIT_3 = -9,
    DRAW = -15,
    PUNCH = 2,
    BEND = 7,
    UPSET = 13,
    SHRINK = 16,
}
