def mean(iterable):
    return sum(iterable) / float(len(iterable))

# Comparisons:
# 100% 1st place = 31.2, 0% 49th-64th place = 100
# 80% 1st place = 62.5, 20% 49th-64th place = 50
# 67% 2nd place = 66, 33% 33rd-48th place = 38.5

def maxScoreFunc(num):
    # Exponential function that decays the max score by 1/2 for every 20% who choose the player
    # num: Percentage of people who chose this player
    # Returns a score (max. 10000).
    CONSTANT = 1 / 2**(1/20.)
    return 1000. * CONSTANT**num

TIES = {1:1, 2:1, 3:1, 4:1, 5:2, 7:2, 9:4, 13:4, 17:8, 25:8, 33:16, 49:16}
PLACES = {newPlace:mean(range(oldPlace, oldPlace+tie)) for oldPlace, tie in TIES.iteritems() for newPlace in range(oldPlace, oldPlace+tie)}

def resultScoreFunc(place):
    # Power function such that 49th-64th place is worth 1/10 of 1st place, assuming same percentages.
    # place: Player's placement
    # Returns a multiplier between 0 and 1.
    # Top 32: 1st, 2nd, 3rd, 4th, 5th (5.5), 7th (7.5), 9th (10.5), 13th (14.5), 17th (20.5), 25th (28.5)
    if type(place) is not int or place <= 0:
        raise ValueError("Place must be a positive integer")
    if place > 64:
        return 0
    normPlace = PLACES[place]
    CONSTANT = -0.57076
    return normPlace**CONSTANT

