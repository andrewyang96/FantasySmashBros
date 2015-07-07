from scraperconfig import ssb4_pools, ssbm_pools
import requests
import HTMLParser
from pyquery import PyQuery as pq
import json

BASEURL = "http://evo2015.s3.amazonaws.com/brackets/{0}_{1}.html"
h = HTMLParser.HTMLParser()

def getPlayers(game, pool):
    url = BASEURL.format(game, pool)
    print "Retrieving pool", pool, "for", game
    res = requests.get(url)
    page = pq(res.text)
    divs = page.find(".player")
    players = []
    for div in divs:
        el = pq(div)
        nameDiv = el.find(".player-name")
        name = h.unescape(nameDiv.text())
        if name != "" and name != "Bye":
            handleDiv = el.find(".player-handle")
            handle = h.unescape(handleDiv.text())
            if handle == "":
                handle = None
            players.append({"name": name, "handle": handle})
    playerSeq = [(pool + "-" + str(playerID+1), playerObj) for playerID, playerObj in enumerate(players)]
    return playerSeq

def getPools(game, poolList):
    players = []
    for pool in poolList:
        players.extend(getPlayers(game, pool))
    return dict(players)

def main():
    ssb4 = getPools("ssb4", ssb4_pools)
    ssbm = getPools("ssbm", ssbm_pools)
    return {"ssb4": ssb4, "ssbm": ssbm}

if __name__ == "__main__":
    players = main()
    with open("ssb4.json", "w") as ssb4:
        print "Dumping SSB4"
        json.dump(players["ssb4"], ssb4)
    with open("ssbm.json", "w") as ssbm:
        print "Dumping SSBM"
        json.dump(players["ssbm"], ssbm)
