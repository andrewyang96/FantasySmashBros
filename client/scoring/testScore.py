from score import *
import csv

def printMaxFunc():
    for percent in xrange(101):
        print "By percent of users choosing player:"
        print percent, ":", round(maxScoreFunc(percent), 1)

def printResultFunc():
    for place in xrange(1,33):
        print "By place"
        print "Place", place, ":", round(resultScoreFunc(place), 3)

def csvDebug():
    with open("scoreMatrix.csv", "wb") as f:
        writer = csv.writer(f)
        # First row: places
        writer.writerow(['',] + range(1,33))
        # Write percentiles
        for percent in range(101):
            writer.writerow([percent,] + [round(maxScoreFunc(percent) * resultScoreFunc(place), 1) for place in range(1,33)])
