from firebase import firebase
from score import maxScoreFunc, resultScoreFunc
import json
import os

ref = firebase.FirebaseApplication("https://fantasy-smash-bros.firebaseio.com/", None)
CURDIR = os.path.dirname(os.path.realpath(__file__))
PLACESPATH = os.path.abspath(os.path.join(CURDIR, "..", "outcome"))
GAMES = ["ssb4", "ssbm"]

def getChoices(game):
    print "Getting choices for", game
    return ref.get("/{0}/choices".format(game), None)

def getFreqs(game):
    print "Getting freqs for", game
    return ref.get("/{0}/freqs".format(game), None)

def getRanks(choices):
    return sorted(choices.keys(), key=lambda choice: -choices[choice]["score"])

def calcScores():
    ret = {game:{} for game in GAMES}
    numParticipants = len(ref.get("/ssb4/participants", None))
    print "NumParticipants:", numParticipants
    for game in GAMES:
        print "Calculating scores for", game
        with open(os.path.join(PLACESPATH, "{0}.json".format(game)), "r") as f:
            places = json.load(f)
        choices = getChoices(game)
        freqs = getFreqs(game)
        for player in choices:
            score = 0
            for choice in choices[player]:
                # Find score
                try:
                    idx = places.index(choice) # Throws ValueError if choice not in places
                    idx += 1
                    popularity = len(freqs[choice])
                    popularity = popularity * 100. / numParticipants
                    score += round(maxScoreFunc(popularity) * resultScoreFunc(idx), 2)
                except ValueError:
                    pass
            ret[game][player] = {"id": player, "score": score}
        # Inject ranks
        ranks = getRanks(ret[game])
        for player in choices:
            ret[game][player]["rank"] = ranks.index(player) + 1
    return ret

def main():
    calcScores()

if __name__ == "__main__":
    with open("rankings.json", "w") as f:
        print "Dumping JSON"
        scores = calcScores()
        json.dump(scores, f)
