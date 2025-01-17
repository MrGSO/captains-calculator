import React from 'react';
import { Card, Group, Box, Text, Image, Tooltip, Indicator, Divider } from '@mantine/core';
import { Recipe } from 'state/app/effects/loadJsonData';
import { RecipeId } from 'state/app/effects/loadJsonData';
import { useAppState } from 'state';
import { Icon } from '@iconify/react';

type RecipeListCardProps = {
    item: Recipe;
    active: boolean;
    available: boolean;
    onSelect(id: RecipeId): void;
}

const RecipeListCard: React.FC<RecipeListCardProps> = ({ item, active, available, onSelect }) => {

    const allProducts = useAppState(state => state.products.items)
    const allMachines = useAppState(state => state.machines.items)

    const onItemClick = React.useCallback((id: RecipeId) => {
        if (available) {            
            onSelect(id)
        }
    }, [onSelect,available]);

    if (!item) return null

    let recipeInputs = item.inputs.map(p => {
        return {
            ...allProducts[p.id],
            quantity: p.quantity
        }
    })
    let recipeOutputs = item.outputs.map(p => {
        return {
            ...allProducts[p.id],
            quantity: p.quantity
        }
    })

    let currentMachine = allMachines[item.machine]

    return (
        <Card
            onClick={() => onItemClick(item.id)}
            shadow="xs"
            sx={(theme) => ({
                cursor: available ? 'pointer': 'initial' ,
                backgroundColor: active ?theme.colorScheme === 'light' ? theme.colors.gray[4] : theme.colors.dark[9] :  '',
                opacity: available ? 1 : 0.4,
                '&:hover': {
                    backgroundColor: available ? theme.colorScheme === 'light' ? theme.colors.gray[3] : theme.colors.dark[9] : ''
                },
            })}
        >
            <Box
                sx={{
                    display: "grid",
                    gridGap: 20,
                    gridTemplateColumns: "auto 1fr"
                }}
            >
                <Box>
                    <Box
                        p={8}
                        sx={theme => ({
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: theme.colorScheme === 'light' ? theme.white : theme.colors.dark[9],
                            borderRadius: theme.radius.sm,
                            pointerEvents: 'none',
                            border: `1px dashed ${theme.colorScheme === 'light' ? theme.colors.gray[4] : theme.colors.dark[9]}`,
                        })}
                    >
                        <Image src={`/assets/buildings/${currentMachine.icon}`} height={62} width={62} />
                    </Box>
                </Box>
                <Box>
                    <Group spacing="xs">
                        <Text sx={{ fontSize: 16, lineHeight: '16px' }} weight="bold">{currentMachine.name}</Text>
                        <Text sx={{ fontSize: 16, lineHeight: '16px' }} color="dimmed">- {item.name}</Text>
                    </Group>
                    <Divider mt="xs" />
                    <Group noWrap mt={15}>
                        <Group
                            noWrap
                            spacing="xs"
                            sx={theme => ({
                                '& .product-input .product-icon': {
                                    color: theme.colors.gray[6]
                                },
                                '& .product-input:last-child .product-icon': {
                                    display: 'none'
                                }
                            })}
                        >
                            {recipeInputs.map(product => {
                                return (
                                    <Group className="product-input" key={`input_${product.id}`} noWrap>
                                        <Tooltip
                                            label={product.name}
                                            withArrow
                                            color="green"
                                            withinPortal
                                        >
                                            <Indicator label={product.quantity} color="green" radius="xs" styles={{ indicator: { fontSize: 11, height: 'auto', paddingRight: 5, paddingLeft: 5 } }} size={8}>
                                                <Box
                                                    p={8}
                                                    sx={theme => ({
                                                        borderRadius: theme.radius.sm,
                                                        background: theme.colors.dark[3]
                                                    })}
                                                >
                                                    <Image src={`/assets/products/${product.icon}`} height={22} width={22} />
                                                </Box>
                                            </Indicator>
                                        </Tooltip>
                                        <Icon className="product-icon" icon="icomoon-free:plus" width={10} />
                                    </Group>
                                )
                            })}
                        </Group>
                        <Group
                            spacing="xs">
                            <Icon className="results-icon" icon="icomoon-free:arrow-right" width={15} />
                        </Group>
                        <Group
                            noWrap
                            spacing="xs"
                            sx={theme => ({
                                '& .product-output .product-icon': {
                                    color: theme.colors.gray[6]
                                },
                                '& .product-output:last-child .product-icon': {
                                    display: 'none'
                                }
                            })}
                        >
                            {recipeOutputs.map(product => {
                                return (
                                    <Group className="product-output" spacing="xs" key={`output_${product.id}`} noWrap>
                                        <Tooltip
                                            label={product.name}
                                            withArrow
                                            color="red"
                                            withinPortal
                                        >
                                            <Indicator label={product.quantity<1?'∞':product.quantity} color="red" radius="xs" styles={{ indicator: { fontSize: 11, height: 'auto', paddingRight: 5, paddingLeft: 5 } }} size={8}>
                                                <Box
                                                    p={8}
                                                    sx={theme => ({
                                                        borderRadius: theme.radius.sm,
                                                        background: theme.colors.dark[3]
                                                    })}
                                                >
                                                    <Image src={`/assets/products/${product.icon}`} height={22} width={22} />
                                                </Box>
                                            </Indicator>
                                        </Tooltip>
                                        <Icon className="product-icon" icon="icomoon-free:plus" width={10} />
                                    </Group>
                                )
                            })}
                        </Group>
                    </Group>
                </Box>
            </Box>
        </Card>
    );
};

export default RecipeListCard;