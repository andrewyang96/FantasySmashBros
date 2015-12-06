var Tabs = ReactSimpleTabs;

// Event listener context
var APP = {};

var GameToggle = React.createClass({
    getDefaultProps: function () {
        // TODO: change in case of multiple events
        return {
            games:[{title:"64",value:"ssb64"},{title:"MELEE",value:"ssbm"},{title:"BRAWL",value:"ssbb"},{title:"SM4SH",value:"ssb4"}]
        };
    },
    
    getInitialState: function () {
        return { checked: this.props.games[0].value };
    },
    
    onChange: function (e) {
        this.setState({checked: e.target.value});
    },
    
    render: function () {
        var checked = this.state.checked;
        var createButton = function (game) {
            return (
            <div className="row" key={game.value}>
                <input type="radio" name="game" id={game.value} value={game.value} defaultChecked={checked === game.value} />
                <label htmlFor={game.value}>{game.title}</label>
            </div>);
        };
        
        return (
        <div className="row">
            <div className="col-xs-12">
                <form id="game-choice-form" onsubmit="return false;" onChange={this.onChange}>
                    {this.props.games.map(createButton)}
                </form>
            </div>
        </div>);
    }
});

var ResultTabs = React.createClass({
    handleBefore: function (e) {
        // console.log("Results tabs handleBefore:", e);
        $(APP).trigger("resultTabChange", e);
    },
    render: function () {
        // TODO: replace with actual results
        return (
        <Tabs onBeforeChange={this.handleBefore}>
            <Tabs.Panel title="Results">
                <h2>How the Smashers placed</h2>
            </Tabs.Panel>
            <Tabs.Panel title="Standings">
                <h2>How well you did</h2>
            </Tabs.Panel>
        </Tabs>);
    }
});

var RightCol = React.createClass({
    mixins: [ReactFireMixin],
    
    componentWillMount: function () {
        // TODO: listen to Firebase changes for uid
    },

    componentDidMount: function () {
        // Add trigger to change content of RightCol depending on state of ActionTab
        $(APP).on("actionTabChange", this.onChangeActiveTab);
    },
    
    getInitialState: function () {
        return {activeActionTab: 1};
    },
    
    onChangeActiveTab: function (e, tab) {
        this.setState({activeActionTab: tab});
    },
    
    render: function () {
        if (this.state.activeActionTab == 1) {
            return (
            <div id="your-choices">
                <h4>Here are your picks:</h4>
                <SmasherList smashers={sampleData} />
            </div>);
        } else if (this.state.activeActionTab == 2) {
            return (
            <ResultTabs />
            );
        }
        throw "Illegal state: " + this.state.activeActionTab;
    }
});

var ScoreSpreadTable = React.createClass({
    propTypes: {scoreSpread: React.PropTypes.array},
    render: function () {
        var createTR = function (s) {
            return <tr key={s.place}><td>{s.place}</td><td>{s.score}</td></tr>;
        };
        return (
        <table className="table table-hover">
            <thead>
                <tr>
                    <th>Place</th>
                    <th>Points</th>
                </tr>
            </thead>
            <tbody>
                {this.props.scoreSpread.map(createTR)}
            </tbody>
        </table>);        
    }
});

var SmasherDetail = React.createClass({
    mixins: [ReactFireMixin],

    getInitialState: function () {
        return {popularity: 0};
    },
    // TODO: Prop for choose or remove button
    // TODO: Make another class without choose/remove btn
    componentWillMount: function () {
        this.initFirebaseListeners.bind(this);
    },

    initFirebaseListeners: function () {
        // Bind Popularity to Firebase
        this.firebaseRefFreqs = ref.child("games").child(this.props.game).child("freqs").child(this.props.smasher.id);
        this.firebaseRefFreqs.on("value", function (snapshot) {
            $.getJSON("/api/play/" + this.props.game + "/popularity/" + this.props.smasher.id, function (data) {
                var pop = data.popularity;
                this.setState({ popularity: pop });
            }).bind(this);
        }).bind(this);
        this.firebaseRefParticipants = ref.child("games").child(this.props.game).child("participants");
        this.firebaseRefParticipants.on("value", function (snapshot) {
            $.getJSON("/api/play/" + this.props.game + "/popularity/" + this.props.smasher.id, function (data) {
                var pop = data.popularity;
                this.setState({ popularity: pop });
            }).bind(this);
        }).bind(this);
    },

    removeFirebaseListeners: function () {
        this.firebaseRefFreqs.off();
        this.firebaseRefParticipants.off();
    },

    componentWillUnmount: function () {
        this.removeFirebaseListeners.bind(this);
    },
    
    propTypes: {smasher: React.PropTypes.object},
    
    render: function () {
        var smasher = this.props.smasher;
        var scoreSpread = calculateScoreSpread(smasher.popularity);
        return (
        <li className="row">
            <div className="col-xs-12">
                <div className="row">
                    <div className="col-xs-4">
                        <div className="row">
                            <div className="col-xs-12 smasher-title">
                                {smasher.handle}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 smasher-subtitle">
                                {smasher.city}, {smasher.state}
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-4 text-center popularity">
                        {this.state.popularity || 0}%
                    </div>
                    <div className="col-xs-4">
                        <div className="row">
                            <div className="col-xs-8">
                                <button type="button" className="btn btn-primary">CHOOSE</button>
                            </div>
                            <div className="col-xs-4">
                                <button type="button" className="btn btn-info btn-circle" data-toggle="collapse" data-target={"#" + smasher.id}>&#9660;</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id={smasher.id} className="collapse">
                    <ScoreSpreadTable scoreSpread={scoreSpread} />
                </div>
            </div>
        </li>);
    }
});

var sampleData = [
    {handle: "Chillin", location: "Virginia", popularity: 45.6, id: "myb"},
    {handle: "Chudat", location: "Virginia", popularity: 50, id: "evo15"},
    {handle: "Zero", location: "Chile", popularity: 80, id: "scarf"},
    {handle: "Mew2king", location: "California", popularity: 69.6, id: "lolm2k"},
    {handle: "David", location: "Philly", popularity: 1.2, id:"jv5ed"}
];

var Pagination = React.createClass({
    getInitialState: function () {
        return {
            pagination: this.props.pagination,
            prevReq: this.props.prevReq
        };
    },
    
    componentDidMount: function () {
        this.update();
    },
    
    componentDidUpdate: function () {
        this.update();
    },
    
    componentWillReceiveProps: function (newProps) {
        if (newProps.pagination.totalPages != this.state.pagination.totalPages) {
            // Flush buttons since totalPage changes
            this.emptyButtons();
        }
        this.updateState(newProps);
    },
    
    updateState: function (newState) {
        // Used for setting new pagination
        this.setState({
            pagination: newState.pagination,
            prevReq: newState.prevReq
        });
    },
    
    handlePageChange: function (event, page) {
        var pObj = this.state.pagination;
        pObj.currPage = page;
        this.setState({ pagination: pObj });
        // Clone obj
        var retObj = $.extend({}, pObj);
        retObj.currPage = page - 1; // API is zero-indexed, twbs-pagination is one-indexed
        this.props.onChange(retObj, this.state.prevReq);
    },
    
    emptyButtons: function () {
        var pButtons = React.findDOMNode(this.refs.buttons);
        $(pButtons).empty();
        $(pButtons).removeData("twbs-pagination");
        $(pButtons).unbind("page");
    },
    
    update: function () {
        var pButtons = React.findDOMNode(this.refs.buttons);
        var totalPages = this.state.pagination.totalPages;
        if (totalPages > 0) {
            $(pButtons).twbsPagination({
                totalPages: totalPages,
                visiblePages: 3,
                onPageClick: this.handlePageChange
            });
        }
    },

    render: function () {
        return (<div ref={this.props.ref}>
            <p ref="info" className="pagination-info text-center">Page {this.state.pagination.currPage} of {this.state.pagination.totalPages}</p>
            <div ref="buttons" className="pagination-sm text-center"></div>
        </div>);
    }
});

var SmasherList = React.createClass({
    // TODO: Prop for choose/remove/none button
    render: function () {
        var createSmasher = function (smasher) {
            return (<SmasherDetail key={smasher.id} smasher={smasher} game={this.props.game} uid={this.props.uid} />);
        }.bind(this);
        return (
        <ol id="search-results">
            {this.props.smashers.map(createSmasher)}
        </ol>);
    }
});

var SearchArea = React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    componentDidMount: function () {
        $("#game-toggle input").change(this.clearSearchResults);
    },

    getInitialState: function () {
        return {
            text: "",
            sortType: 0,
            sortOrder: 1,
            searchResults: [],
            pagination: {
                currPage: 0,
                totalPages: 0
            },
            prevReq: {
                game: "",
                searchQuery: "",
                sortType: 0,
                sortOrder: 1
            }
        };
    },
    
    onChangeText: function (e) {
        this.setState({ text: e.target.value });        
    },
    
    onChangeSortType: function (e) {
        this.setState({ sortType: e.target.value });
    },
    
    onChangeSortOrder: function (e) {
        this.setState({ sortOrder: e.target.value });
    },
    
    clearSearchResults: function (e) {
        this.setState({
            searchResults: [],
            pagination: {
                currPage: 0,
                totalPages: 0
            },
            prevReq: {
                game: "",
                searchQuery: "",
                sortType: this.state.prevReq.sortType,
                sortOrder: this.state.prevReq.sortOrder
            }
        });
    },
    
    handleSubmit: function (e) {
        e.preventDefault();
        // Retrieve game value
        var game = $("#game-toggle input:checked").val();
        var searchQuery = this.state.text;
        var sortType = this.state.sortType;
        var sortOrder = this.state.sortOrder;
        this.search(0, game, searchQuery, sortType, sortOrder);
    },

    search: function (from, game, searchQuery, sortType, sortOrder) {
        if (!from || from < 0) from = 0;
        var limit = 10; // HARD-CODED
        var fromIdx = from * limit; // Convert from value from page offset to index offset
        var url = "/api/play/" + game + "/search?searchQuery=" + escape(searchQuery) + "&sortType=" + sortType + "&sortOrder=" + sortOrder + "&from=" + fromIdx;
        console.log(url);
        $.ajax({
            url: url,
            type: "GET",
            success: function (data) {
                this.setState({
                    searchResults: data.data,
                    pagination: {
                        currPage: data.pagination.currPage,
                        totalPages: data.pagination.totalPages
                    },
                    prevReq: {
                        game: game,
                        searchQuery: searchQuery,
                        sortType: sortType,
                        sortOrder: sortOrder
                    }
                });
            }.bind(this),
            error: function (data) {
                alert("Couldn't load search results!");
            }
        });
    },
    
    render: function () {
        var paginationLink = this.linkState("pagination");
        var prevReqLink = this.linkState("prevReq");
        var handleChange = function (newP, prevReq) {
            // newP should be an updated pagination object
            paginationLink.requestChange(newP);
            // Refresh list by calling search API
            this.search(newP.currPage, prevReq.game, prevReq.searchQuery, prevReq.sortType, prevReq.sortOrder);
        }.bind(this);
        var game = $("#game-toggle input:checked").val();
        var uid = getAuthData().uid;
        return (
        <div className="container-fluid">
            <form id="search-form" onSubmit={this.handleSubmit}>
                <div className="row">
                    <div className="col-md-12">
                        <input type="text" name="searchQuery" placeholder="Search" onChange={this.onChangeText} value={this.state.text} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-7">
                        <select name="sortType" onChange={this.onChangeSortType} value={this.state.sortType}>
                            <option value="0">Sort by Handle</option>
                            <option value="1">Sort by Popularity</option>
                        </select>
                    </div>
                    <div className="col-md-5">
                        <select name="sortOrder" onChange={this.onChangeSortOrder} value={this.state.sortOrder}>
                            <option value="1">Ascending</option>
                            <option value="-1">Descending</option>
                        </select>
                    </div>
                </div>
            </form>
            <SmasherList smashers={this.state.searchResults} game={game} uid={uid} />
            <Pagination pagination={paginationLink.value} prevReq={prevReqLink.value} onChange={handleChange} />
        </div>);
    }
});

var ActionTabs = React.createClass({
    handleBefore: function (e) {
        $(APP).trigger("actionTabChange", e);
    },
    
    render: function () {
        return (
        <div className="col-xs-5 mid-col">
            <Tabs onBeforeChange={this.handleBefore}>
                <Tabs.Panel title="Play">
                    <SearchArea />
                </Tabs.Panel>
                <Tabs.Panel title="Overview">
                    <h2>How well you did</h2>
                </Tabs.Panel>
            </Tabs>
        </div>);
    }
});

$(document).ready(function () {
    // First check if logged in, then...
    React.render(<GameToggle />, $("#game-toggle").get(0));
    React.render(<ActionTabs />, $("#mid-container").get(0));
    // React.render(<RightCol />, $(".right-col").get(0));
    
    /*
    $(APP).on("resultTabChange", function (e, tab) {
        console.log("Received resultTabChange:", tab);
    });
    $(APP).on("actionTabChange", function (e, tab) {
        console.log("Received actionTabChange:", tab);
    });*/
});
