import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, ActivityIndicator, TouchableOpacity } from 'react-native';
import { COLORS } from '../Constant/color'

export default class ListData extends Component {

    constructor(props) {
        super(props)
        this.state = {
            ListData: null,
            isLoaderShow: false,
            page:0,
            totalPage:0
        }
    }

    componentDidMount = () => {
        this.initData()
    }

    initData = () => {
        this.setState({ isLoaderShow: true })
        fetch('https://hn.algolia.com/api/v1/search_by_date?tags=story&page='+this.state.page)
            .then(response => response.json())
            .then(data => {
                this.setState({ isLoaderShow: false })
                this.setState({totalPage:data.nbPages})
                if(this.state.ListData){
                    this.setState({ ListData: this.state.ListData.concat(data.hits) })
                }else{
                    this.setState({ ListData: data.hits })
                }
               
            });
    }
    navigateDetail = (item) =>{
        this.props.navigation.navigate('DetailScreen', {
            item: item,
          });
    }

    loadMoreData = ()=>{
        const {totalPage,page} = this.state
        if(totalPage>=page){
            this.setState({page:page+1},this.initData())
        }
      
    }

    renderFooter = ()=>{
        return (
            //Footer View with Load More button
              <View style={styles.footer}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={()=>this.loadMoreData()}
                  //On Click of button calling loadMoreData function to load more data
                  style={styles.loadMoreBtn}>
                  <Text style={styles.btnText}>Load More</Text>
                  {this.state.fetching_from_server ? (
                    <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
                  ) : null}
                </TouchableOpacity>
              </View>
            );
    }
    render() {
        const {totalPage,page, ListData, isLoaderShow } = this.state
        return (

            <SafeAreaView style={styles.container}>
                {isLoaderShow ? <ActivityIndicator size="small" color='#000' /> : null}
                <View style={styles.countView}>
                <Text style={styles.count}>{page+1} / </Text>
                <Text style={styles.count}>{totalPage} Pages</Text>
                </View>
               
                <FlatList
                    data={ListData}
                   
                    renderItem={({ item, index }) => (
                        <TouchableOpacity onPress={() => this.navigateDetail(item)} style={styles.CardView}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.created}>Created at :{item.created_at}</Text>
                            <Text style={styles.auther}>{item.author}</Text>
                        </TouchableOpacity>
                    )}
                     ListFooterComponent={()=>this.renderFooter()}
                    keyExtractor={item => item.objectID}
                />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 30,
        backgroundColor: COLORS.white
    },
    CardView: {
        height: 100,
        width: '95%',
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: COLORS.gray,
        borderColor: COLORS.gray,
        margin: 5,
        padding: 5,
        justifyContent: 'center',

    },
    title: {
        color: COLORS.white,
        fontSize: 12,
        flex: 1,
        backgroundColor: COLORS.theme,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10, padding: 5
    },
    created: {
        color: COLORS.black,
        fontSize: 15
    },
    auther: {
        color: COLORS.theme,
        fontSize: 18,
        textTransform: 'capitalize',
        textAlign: 'right',
        marginTop: 15
    },
    footer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      },
      loadMoreBtn: {
        padding: 10,
        backgroundColor: '#800000',
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      btnText: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
      },
      count:{
          color:COLORS.theme,
          fontWeight:'bold',
          fontSize:15
      },
      countView:{
          flexDirection:'row',
          width:'95%',
      }
})