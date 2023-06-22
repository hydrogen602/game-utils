use itertools::Itertools;
use strum::IntoEnumIterator;
use strum::{EnumIter, EnumString};

#[derive(Debug, Copy, Clone, PartialEq, Eq, Hash, EnumIter, EnumString)]
pub enum SequenceGroupType {
    Hit,
    Draw,
    Punch,
    Bend,
    Upset,
    Shrink,
}

// like SequenceType, but separates the different hit types
#[repr(i8)]
#[derive(Debug, Copy, Clone, PartialEq, Eq, Hash, EnumIter)]
pub enum SequenceUniqueType {
    Hit1 = -3,
    Hit2 = -6,
    Hit3 = -9,
    Draw = -15,
    Punch = 2,
    Bend = 7,
    Upset = 13,
    Shrink = 16,
}

use std::collections::HashSet;
use std::fmt;
use std::ops::Deref;

impl fmt::Display for SequenceUniqueType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        use SequenceUniqueType::*;
        match self {
            Hit1 => write!(f, "Light Hit"),
            Hit2 => write!(f, "Medium Hit"),
            Hit3 => write!(f, "Heavy Hit"),
            Draw => write!(f, "Draw"),
            Punch => write!(f, "Punch"),
            Bend => write!(f, "Bend"),
            Upset => write!(f, "Upset"),
            Shrink => write!(f, "Shrink"),
        }
    }
}

impl SequenceGroupType {
    fn expand_to_unique(&self) -> Box<[SequenceUniqueType]> {
        use SequenceGroupType::*;
        match self {
            Hit => Box::new([
                SequenceUniqueType::Hit1,
                SequenceUniqueType::Hit2,
                SequenceUniqueType::Hit3,
            ]),
            Draw => Box::new([SequenceUniqueType::Draw]),
            Punch => Box::new([SequenceUniqueType::Punch]),
            Bend => Box::new([SequenceUniqueType::Bend]),
            Upset => Box::new([SequenceUniqueType::Upset]),
            Shrink => Box::new([SequenceUniqueType::Shrink]),
        }
    }
}

fn sum_actions(actions: &[SequenceUniqueType]) -> i32 {
    actions.iter().fold(0, |acc, x| acc + *x as i32)
}

pub fn find_best_inverse_of_seq(
    g: &[SequenceGroupType],
) -> impl Iterator<Item = Annotated<Vec<SequenceUniqueType>, Vec<SequenceUniqueType>>> {
    let possible_sums = g.iter().map(SequenceGroupType::expand_to_unique).fold(
        HashSet::from([Annotated::new(0, Vec::new())]),
        |acc, expanded_group| {
            let mut new_acc = HashSet::new();
            for (
                Annotated {
                    val: acc_val,
                    annotation,
                },
                val,
            ) in acc.iter().cartesian_product(expanded_group.iter())
            {
                new_acc.insert(Annotated {
                    val: acc_val + *val as i32,
                    annotation: {
                        let mut new_annotation = annotation.clone();
                        new_annotation.push(*val);
                        new_annotation
                    },
                });
            }
            new_acc
        },
    );

    possible_sums
        .into_iter()
        .map(|annotated_sum| annotated_sum.map(|sum| -sum))
        .filter_map(|Annotated { val, annotation }| {
            get_best_actions_with_sum(val).map(|result| Annotated::new(result, annotation))
        })
}

fn get_best_actions_with_sum(sum: i32) -> Option<Vec<SequenceUniqueType>> {
    // find the shortest sequence that adds up to sum

    for len in 0..6 {
        // search for sequence of length len
        let first_working_combo = SequenceUniqueType::iter()
            .combinations(len)
            .filter(|c| {
                // filter out sequences that don't add up to sum
                sum_actions(&c) == sum
            })
            .next();

        if let Some(works) = first_working_combo {
            return Some(works);
        }
    }

    None
}

pub struct Annotated<T, A> {
    pub val: T,
    pub annotation: A,
}

impl<T, A> Annotated<T, A> {
    pub fn new(val: T, annotation: A) -> Self {
        Self { val, annotation }
    }

    pub fn map<U>(self, f: impl FnOnce(T) -> U) -> Annotated<U, A> {
        Annotated {
            val: f(self.val),
            annotation: self.annotation,
        }
    }
}

impl<T> Deref for Annotated<T, Vec<T>> {
    type Target = T;

    fn deref(&self) -> &Self::Target {
        &self.val
    }
}

impl<T: PartialEq, A> PartialEq for Annotated<T, A> {
    fn eq(&self, other: &Self) -> bool {
        self.val == other.val
    }
}

impl<T: Eq, A> Eq for Annotated<T, A> {}

impl<T: std::hash::Hash, A> std::hash::Hash for Annotated<T, A> {
    fn hash<H: std::hash::Hasher>(&self, state: &mut H) {
        self.val.hash(state);
    }
}
