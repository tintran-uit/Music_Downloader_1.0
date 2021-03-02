import { ImageCollectionDefault } from '@assets/images';
import { IconCheck, IconMusicDefault } from '@assets/svg';
import color from '@config/colors';
import { LISTMUSIC } from '@config/constrans';
import metric from '@config/metrics';
import stylesGeneral from '@config/stylesGeneral';
import { useNavigation } from '@react-navigation/native';
import { addItemCollectionEdit, removeItemCollectionEdit, setCurrentIDCollectionSelect, setEditMode } from '@services/redux/actions';
import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';

const ItemCollection = (item: any) => {
    const navigation = useNavigation();
    const editMode = useSelector((state: any) => state?.editMode)
    const listCollectionEdit = useSelector((state: any) => state?.listCollectionEdit)
    const [select, setSelect] = useState(false);
    const dispatch = useDispatch();
    const [opacity, setOpacity] = useState(0.2)
    const [listUrlImage, setListUrlImage] = useState<any[]>([])
    const listMusic = useSelector((state: any) => state?.listMusic)
    const [isOneSong, setIsOneSong] = useState(false)

    useEffect(() => {
        if (select) {
            setOpacity(0.8)
            dispatch(addItemCollectionEdit(item))
        }
        else {
            setOpacity(0.55)
            dispatch(removeItemCollectionEdit(item))
        }
    }, [select])

    useEffect(() => {
        if (listCollectionEdit.length == 0) {
            setSelect(false)
        }
    }, [listCollectionEdit])

    useEffect(() => {
        if (!editMode) {
            setSelect(false)
        }
    }, [editMode])

    useEffect(() => {
        if (item.id != 1) {
            let data: any[] = []
            let listUrl: any[] = []
            if (listMusic != undefined || listMusic.length > 0) {
                listMusic.forEach((element: any) => {
                    if (element.id_collection == item.id) {
                        data.push(element)
                    }
                })
            }
            if (data.length > 1) {
                for (let i = 0; i < 4; i++) {
                    if (data[i] != undefined) {
                        listUrl.push({
                            id: i,
                            thumbnail: data[i].thumbnail
                        })
                    }
                    else {
                        listUrl.push({
                            id: i,
                            thumbnail: ''
                        })
                    }
                }
                setIsOneSong(false)
            }
            else {
                listUrl.push({
                    id: 0,
                    thumbnail: data[0] != undefined ? data[0].thumbnail : ''
                })
                setIsOneSong(true)
            }

            setListUrlImage(listUrl)
        }
    }, [listMusic])

    return (
        <TouchableOpacity
            style={[styles.contain, {}]}
            onPress={() => {
                if (editMode) {
                    setSelect(!select)
                }
                else {
                    dispatch(setCurrentIDCollectionSelect(item.id))
                    navigation.navigate(LISTMUSIC, { id: item.id, name: item.name })
                }
            }}
            onLongPress={() => {
                if (!editMode) {
                    dispatch(setEditMode(true))
                    setSelect(true)
                }
            }}
            activeOpacity={0.7}
        >

            {item.id == 1 ? (
                <Image
                                style={styles.imageContain}
                                source={ImageCollectionDefault}
                                resizeMode={'cover'}
                            />            ) : (
                    <FlatList
                        style={styles.imageContain}
                        data={listUrlImage}
                        renderItem={(item: any) => {                           
                            return <Image
                                style={isOneSong?styles.imageContain: styles.image}
                                source={(item.item.thumbnail != '') ? { uri: item.item.thumbnail } : ImageCollectionDefault}
                                resizeMode={'cover'}
                            />
                        }}
                        keyExtractor={item => item.id}
                        numColumns={2}
                    />
                )}

            <View style={[styles.containOpacity, stylesGeneral.centerAll, { opacity: opacity }]}></View>

            <Text style={styles.title}>
                {item.name}
            </Text>

            {select ? (<View style={[styles.containClick, stylesGeneral.centerAll]}>
                <View style={[stylesGeneral.centerAll, { height: 60, width: 60, backgroundColor: '#fff', borderRadius: 30 }]}>
                    <IconCheck color="#000" />
                </View>
            </View>) : null}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    contain: {
        borderRadius: 12,
        height: (metric.DEVICE_WIDTH / 2 - 24),
        width: (metric.DEVICE_WIDTH / 2 - 24),
        margin: 8,
    },
    title: {
        fontSize: 16,
        color: color.TITLE,
        fontWeight: 'bold',
        position: 'absolute',
        bottom: 0,
        left: 0,
        marginHorizontal: 16,
        marginBottom: 12
    },
    containOpacity: {
        borderRadius: 12,
        flex: 1,
        backgroundColor: "#000",
        height: (metric.DEVICE_WIDTH / 2 - 24),
        width: (metric.DEVICE_WIDTH / 2 - 24),
        position: 'absolute',
        top: 0,
        left: 0,
    },
    containClick: {
        borderRadius: 12,
        flex: 1,
        height: (metric.DEVICE_WIDTH / 2 - 24),
        width: (metric.DEVICE_WIDTH / 2 - 24),
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: 0.8
    },
    image: {
        height: (metric.DEVICE_WIDTH / 2 - 24) / 2,
        width: (metric.DEVICE_WIDTH / 2 - 24) / 2,
    },
    imageContain: {
        height: (metric.DEVICE_WIDTH / 2 - 24),
        width: (metric.DEVICE_WIDTH / 2 - 24),
        borderRadius: 12,
        overflow: 'hidden'
    }
})

export default ItemCollection;