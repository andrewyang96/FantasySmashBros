from firebase import firebase
import os
import json
import datetime

ref = firebase.FirebaseApplication("https://fantasy-smash-bros.firebaseio.com/", None)
CURDIR = os.path.dirname(os.path.realpath(__file__))
DATAFILEPATH = os.path.abspath(os.path.join(CURDIR, "..", "data", "{0}.json"))
OUTFILEPATH = os.path.join(CURDIR, "popular.json")
GAMES = ["ssb4", "ssbm"]

def getFreqs(game, limit=None):
    print "Fetching players for game", game
    participants = ref.get("/{0}/participants".format(game), None)
    numParticipants = float(len(participants))
    print "There are", numParticipants, "in game", game
    res = ref.get("/{0}/freqs".format(game), None)
    freqs = sorted([(ID, 100 * len(players) / numParticipants) for ID, players in res.iteritems()], key=lambda x: -x[1])
    print "Returning frequencies"
    if limit is None or limit <= 0:
        return freqs
    else:
        return freqs[:limit]

def getPlayers(game):
    print "Getting player list for game", game
    with open(DATAFILEPATH.format(game), "r") as f:
        return json.load(f)

def combineFreqsAndPlayers(game, limit=None):
    freqs = getFreqs(game, limit)
    players = getPlayers(game)
    ret = []
    for freq in freqs:
        newObj = {"id": freq[0], "popularity": round(freq[1], 2)}
        newObj.update(players[freq[0]])
        ret.append(newObj)
    return ret

def main():
    ret = {"lastUpdated": str(datetime.datetime.now())}
    for game in GAMES:
        ret[game] = combineFreqsAndPlayers(game)
    with open(OUTFILEPATH, "w") as f:
        json.dump(ret, f)

if __name__ == "__main__":
    main()
