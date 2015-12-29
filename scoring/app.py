from flask import Flask, jsonify, request, make_response, Markup
from fsb_scoring import maxScoreFunc, resultMultiplierFunc, generateScoreTable

app = Flask(__name__)

@app.route('/')
def info():
	return Markup(
		'''
		<h2>API routes</h2>
		<ul>
		<li><tt>maxscore</tt>: calculate max score given a <tt>proportion</tt> querystring parameter; must be in interval [0,1]</li>
		<li><tt>resultmultiplier</tt>: calculate result multiplier given a <tt>place</tt> querystring parameter; must be greater than 0</li>
		<li><tt>score</tt>: calculate score given valid <tt>proportion</tt> and <tt>place</tt> querystring parameters</li>
		<li><tt>table</tt>: generate CSV table of scores resulting from different maxScore-resultMultiplier combinations</li>
		</ul>
		'''
	)

@app.route('/maxscore')
def calcMaxScore():
	try:
		proportion = float(request.args['proportion'])
		if 0.0 <= proportion <= 1.0:
			return jsonify({ 'maxScore' : maxScoreFunc(proportion) })
		else:
			return make_response('proportion is not in interval [0,1]', 400)
	except (KeyError, ValueError):
		return make_response('proportion parameter missing or malformed', 400)

@app.route('/resultmultiplier')
def calcResultMultipler():
	try:
		place = int(request.args['place'])
		if place > 0:
			return jsonify({ 'resultMultiplier' : resultMultiplierFunc(place) })
		else:
			return make_response('place must be greater than 0', 400)
	except (KeyError, ValueError):
		return make_response('place parameter missing or malformed', 400)

@app.route('/score')
def calcScore():
	try:
		proportion = float(request.args['proportion'])
		if 0.0 <= proportion <= 1.0:
			try:
				place = int(request.args['place'])
				if place > 0:
					maxScore = maxScoreFunc(proportion)
					resultsMultiplier = resultMultiplierFunc(place)
					score = round(maxScore * resultsMultiplier, 1)
					return jsonify({ 'score': score })
				else:
					return make_response('place must be greater than 0', 400)
			except (KeyError, ValueError):
				return make_response('place parameter missing or malformed', 400)
		else:
			return make_response('proportion is not in interval [0,1]', 400)
	except (KeyError, ValueError):
		return make_response('proportion parameter missing or malformed', 400)

@app.route('/table')
def generateCSVScoreTable():
	scoreTable = generateScoreTable()
	responseString = ','.join([' '] + map(str, range(1, 33))) + '\n'
	for pr, row in enumerate(scoreTable):
		responseString += (','.join([str(pr)] + map(str, row)) + '\n')
	print responseString
	return responseString, 200, {'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'inline'}

if __name__ == '__main__':
	app.run()
