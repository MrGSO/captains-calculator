import React from 'react';
import { Box, Grid, Image, Group, Divider, Stack, Tooltip, Text, ScrollArea, Modal, Button } from '@mantine/core';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import { Icon } from '@iconify/react';

import { sortArray } from 'utils/objects';

import { ProductId } from 'state/app/effects';
import { RecipeIOImportProduct, RecipeIOExportProduct, RecipeIODictInput, RecipeIODictOutput } from 'state/recipes/ProductionNode';

import CostsBadge from 'components/ui/CostsBadge';
import NeedsBage from 'components/ui/NeedsBadge';
import Icons from 'components/ui/Icons';
import { NodeRecipeLink } from 'components/calculator/NodeRecipeSelect';
import { RecipeNodeData } from './Editor';
import { useModals } from '@mantine/modals';
import { useActions } from 'state';

const handleStyle: React.CSSProperties = { border: 'none', width: 'auto', height: 'auto', position: 'relative', top: 'initial', left: 'initial', right: 'initial', bottom: 'initial', borderRadius: 0, transform: 'initial', backgroundColor: 'transparent' }

export const RecipeNodeType = ({ id, data: { recipe, machine, category, inputs, outputs, sources, targets } }: NodeProps<RecipeNodeData>) => {

    const [modalOpened, setModalOpened] = React.useState(false);
    const [selectedDirection, setSelectedDirection] = React.useState<'input' | 'output'>('input');
    const [selectedProduct, setSelectedProduct] = React.useState<RecipeIOImportProduct | RecipeIOExportProduct | null>(null);
    const [selectedDestinations, setSelectedDestinations] = React.useState<RecipeIODictInput | RecipeIODictOutput | {}>({});
    const deleteNode = useActions().recipes.deleteNode    
    const modals = useModals();

    const handleLinkCreate = (direction: 'input' | 'output', product: RecipeIOImportProduct | RecipeIOExportProduct) => {
        setSelectedDirection(direction)
        setSelectedProduct(product)
        setSelectedDestinations(direction === 'input' ? inputs : outputs)
        setModalOpened(true)
    }

    const handleModalClose = () => {
        setModalOpened(false)
        setSelectedProduct(null)
        setSelectedDestinations({})
    }

    const handleNodeDelete = (nodeId: string) => {
        console.log(nodeId)
        const openConfirmModal = () => modals.openConfirmModal({
            title: 'Confirm Delete',
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to delete this item: <strong>{machine.name}</strong>?
                </Text>
            ),
            confirmProps: { color: 'red' },
            labels: { confirm: 'Delete Node', cancel: 'Cancel' },
            onConfirm: () => deleteNode(nodeId),
        });
        openConfirmModal()
    }

    return (

        <Box
            key={`recipe-node-${id}`}
            sx={theme => ({
                backgroundColor: theme.colorScheme === 'light' ? theme.white : theme.colors.dark[8],
                borderRadius: theme.radius.sm,
                boxShadow: theme.shadows.sm,
                minWidth: 240
            })}
        >
            {selectedProduct && (
                <Modal
                    size="xl"
                    opened={modalOpened}
                    onClose={handleModalClose}
                    title={<Text weight={600}>{`Select ${selectedDirection === 'input' ? 'Input Source' : 'Output Target'} For ${selectedProduct.name}`}</Text>}
                >
                    <Box sx={{ height: 500 }}>
                        <Box
                            sx={{
                                overflow: 'hidden',
                                position: 'relative',
                                height: '100%'
                            }}
                        >
                            <ScrollArea
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    bottom: 0,
                                    left: 0,
                                    right: 0
                                }}
                            >
                                <Box>

                                    <Stack spacing="xs">

                                        {Object.keys(selectedDestinations).filter(productId => productId === selectedProduct.id).map((productId, key) => {

                                            try {
                                                let destinationRecipes = selectedDirection === 'input' ? sources[productId as ProductId] : targets[productId as ProductId]
                                                let product = selectedDirection === 'input' ? inputs[productId] : outputs[productId]
                                                return (
                                                    <NodeRecipeLink
                                                        key={key}
                                                        direction={selectedDirection}
                                                        recipes={destinationRecipes}
                                                        label={product.name}
                                                        currentNodeId={id}
                                                        product={product}
                                                        onSelect={handleModalClose}
                                                    />
                                                )
                                            } catch (e: any) {
                                                console.error(e.message)
                                                return null
                                            }
                                        })}

                                    </Stack>
                                </Box>
                            </ScrollArea>
                        </Box>
                    </Box >
                </Modal>
            )}
            <Box>
                <Group position="apart" px="md" pt="md" pb={0}>
                    <Tooltip
                        label={machine.name}
                        withArrow
                        withinPortal
                    >
                        <Box
                            p={4}
                            sx={theme => ({
                                borderRadius: theme.radius.sm,
                                background: theme.colorScheme === 'light' ? theme.colors.dark[3] : theme.colors.dark[5]
                            })}
                        >
                            <Image
                                height={22}
                                radius="md"
                                src={`/assets/buildings/${machine.icon}`} alt={machine.name}
                            />
                        </Box>
                    </Tooltip>

                    <Group spacing={5}>
                        <Text weight="bolder" size="lg" sx={{ lineHeight: '1em' }}>{machine.name}</Text>
                        <Button
                            variant="subtle"
                            color="red"
                            sx={{
                                padding: 6,
                                height: 'auto'
                            }}
                            onClick={() => handleNodeDelete(id)}
                        >
                            <Box
                                component='span'
                                sx={theme => ({
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    pointerEvents: 'none',
                                    color: theme.colors.red[9],
                                })}
                            >
                                <Icon icon={Icons.delete} width={16} style={{pointerEvents: 'none'}}/>
                            </Box>
                        </Button>
                    </Group>
                    <Tooltip
                        label={category.name}
                        withArrow
                        withinPortal
                    >
                        <Box
                            p={4}
                            sx={theme => ({
                                borderRadius: theme.radius.sm,
                                background: theme.colorScheme === 'light' ? theme.colors.dark[3] : theme.colors.dark[5]
                            })}
                        >
                            <Image src={`/assets/categories/${category.id}.png`} alt={category.name} height={22} />
                        </Box>
                    </Tooltip>
                </Group>
            </Box>

            <Divider py="xs" variant="solid" labelPosition="center" label="Inputs & Outputs" />
            <Grid gutter={40}>
                <Grid.Col span={6}>
                    <Stack spacing="sm" justify="space-around">
                        {Object.keys(inputs).sort((a, b) => sortArray(inputs[a].name, inputs[b].name)).map(productId => {
                            let product = inputs[productId]
                            return (
                                <Box key={`recipe-handle-input-${productId}`} sx={{ marginLeft: product.maxed ? -14 : -47 }} className='nodrag'>
                                    <Group spacing={5} noWrap>
                                        {!product.maxed && (
                                            <Tooltip
                                                label="Add Input Source"
                                                withArrow
                                                withinPortal
                                                allowPointerEvents
                                                position="left"
                                                gutter={5}
                                            >
                                                <Box
                                                    onClick={() => handleLinkCreate('input', product)}
                                                    sx={theme => ({
                                                        width: 28,
                                                        height: 28,
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        backgroundColor: theme.colorScheme === 'light' ? theme.white : theme.colors.dark[9],
                                                        borderRadius: theme.radius.sm,
                                                        boxShadow: theme.shadows.sm,
                                                        cursor: "default",
                                                        '&:hover': {
                                                            backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[2] : theme.colors.dark[6],
                                                        }
                                                    })}
                                                >
                                                    <Icon icon={Icons.add} />
                                                </Box>
                                            </Tooltip>
                                        )}
                                        <Handle
                                            key={`${id}-${product.id}-input`}
                                            id={`${id}-${product.id}-input`}
                                            type="target"
                                            position={Position.Left}
                                            style={handleStyle}
                                        >
                                            <Box sx={theme => ({
                                                width: 28,
                                                height: 28,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: theme.colors.green[8],
                                                borderRadius: theme.radius.sm,
                                                pointerEvents: 'none'
                                            })}
                                            >
                                                <Text color="white" align="center" size="sm" sx={{ lineHeight: 24 }}>{product.imported}</Text>
                                            </Box>
                                        </Handle>
                                        <Box sx={theme => ({
                                            width: 28,
                                            height: 28,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: theme.colorScheme === 'light' ? theme.white : theme.colors.dark[7],
                                            borderRadius: theme.radius.sm,
                                            pointerEvents: 'none',
                                            border: `1px dashed ${theme.colorScheme === 'light' ? theme.colors.gray[4] : theme.colors.dark[4]}`,
                                        })}
                                        >
                                            <Text align="center" size="sm" sx={{ lineHeight: 24 }}>{product.quantity}</Text>
                                        </Box>
                                        <Group spacing={5} noWrap>
                                            <Box
                                                sx={theme => ({
                                                    border: `1px dashed ${theme.colorScheme === 'light' ? theme.colors.gray[4] : theme.colors.dark[4]}`,
                                                    borderRadius: theme.radius.sm,
                                                    padding: 3
                                                })}
                                            >
                                                <Image src={`/assets/products/${product.icon}`} alt='test' height={20} width={20} style={{ pointerEvents: 'none' }} />
                                            </Box>
                                            {machine.isStorage || product.quantity === product.imported ? (
                                                <Tooltip
                                                    label="Input Satisfied"
                                                    withArrow
                                                    withinPortal
                                                    allowPointerEvents
                                                >
                                                    <Box sx={theme => ({
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        pointerEvents: 'none',
                                                        color: theme.colors.green[9],
                                                    })}
                                                    >
                                                        <Icon icon={Icons.successCircle} />
                                                    </Box>
                                                </Tooltip>
                                            ) : (
                                                <Tooltip
                                                    label="Missing Input"
                                                    withArrow
                                                    withinPortal
                                                    allowPointerEvents
                                                >
                                                    <Box sx={theme => ({
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        pointerEvents: 'none',
                                                        color: theme.colors.red[9],
                                                    })}
                                                    >
                                                        <Icon icon={Icons.warningCircle} />
                                                    </Box>
                                                </Tooltip>
                                            )}
                                        </Group>
                                    </Group>
                                </Box>
                            )
                        })}
                    </Stack>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Stack spacing="sm" justify="space-around" align="flex-end">
                        {Object.keys(outputs).sort((a, b) => sortArray(outputs[a].name, outputs[b].name)).map(productId => {
                            let product = outputs[productId]
                            return (
                                <Box key={`recipe-handle-output-${productId}`} sx={{ marginRight: product.maxed ? -14 : -47 }} className='nodrag'>
                                    <Group spacing={5} noWrap>
                                        <Group spacing={5} noWrap>
                                            {(machine.isStorage || machine.isMine) || product.quantity === product.exported ? (
                                                <Tooltip
                                                    label="Output Satisfied"
                                                    withArrow
                                                    withinPortal
                                                    allowPointerEvents
                                                >
                                                    <Box sx={theme => ({
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        pointerEvents: 'none',
                                                        color: theme.colors.green[9],
                                                    })}
                                                    >
                                                        <Icon icon={Icons.successCircle} />
                                                    </Box>
                                                </Tooltip>
                                            ) : (
                                                <Tooltip
                                                    label="Output Is Full"
                                                    withArrow
                                                    withinPortal
                                                    allowPointerEvents
                                                >
                                                    <Box sx={theme => ({
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        pointerEvents: 'none',
                                                        color: theme.colors.red[9],
                                                    })}
                                                    >
                                                        <Icon icon={Icons.warningCircle} />
                                                    </Box>
                                                </Tooltip>
                                            )}
                                            <Box
                                                sx={theme => ({
                                                    border: `1px dashed ${theme.colorScheme === 'light' ? theme.colors.gray[4] : theme.colors.dark[4]}`,
                                                    borderRadius: theme.radius.sm,
                                                    padding: 3
                                                })}
                                            >
                                                <Image src={`/assets/products/${product.icon}`} alt='test' height={20} width={20} style={{ pointerEvents: 'none' }} />
                                            </Box>
                                        </Group>
                                        <Box sx={theme => ({
                                            width: 28,
                                            height: 28,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: theme.colorScheme === 'light' ? theme.white : theme.colors.dark[7],
                                            borderRadius: theme.radius.sm,
                                            pointerEvents: 'none',
                                            border: `1px dashed ${theme.colorScheme === 'light' ? theme.colors.gray[4] : theme.colors.dark[4]}`,
                                        })}
                                        >
                                            <Text align="center" size="sm" sx={{ lineHeight: 24, fontFamily: product.quantity < 1 ? 'Verdana' : '' }}>{product.quantity < 1 ? '∞' : product.quantity}</Text>
                                        </Box>
                                        <Handle
                                            key={`${id}-${product.id}-output`}
                                            id={`${id}-${product.id}-output`}
                                            type="source"
                                            position={Position.Right}
                                            style={handleStyle}
                                        >
                                            <Box sx={theme => ({
                                                width: 28,
                                                height: 28,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: theme.colors.red[8],
                                                borderRadius: theme.radius.sm,
                                                pointerEvents: 'none'
                                            })}
                                            >
                                                <Text color="white" align="center" size="sm" sx={{ lineHeight: 24 }}>{product.exported}</Text>
                                            </Box>
                                        </Handle>
                                        {!product.maxed && (
                                            <Tooltip
                                                label="Add Output Target"
                                                withArrow
                                                withinPortal
                                                allowPointerEvents
                                                position="right"
                                            >
                                                <Box
                                                    onClick={() => handleLinkCreate('output', product)}
                                                    sx={theme => ({
                                                        width: 28,
                                                        height: 28,
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        backgroundColor: theme.colorScheme === 'light' ? theme.white : theme.colors.dark[9],
                                                        borderRadius: theme.radius.sm,
                                                        boxShadow: theme.shadows.sm,
                                                        cursor: "default",
                                                        '&:hover': {
                                                            backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[2] : theme.colors.dark[6],
                                                        }
                                                    })}
                                                >
                                                    <Icon icon={Icons.add} />
                                                </Box>
                                            </Tooltip>
                                        )}
                                    </Group>
                                </Box>
                            )
                        })}
                    </Stack>
                </Grid.Col>
            </Grid>

            <Divider py="xs" variant="solid" labelPosition="center" label="Costs & Needs" />
            <Box pb="md" px="md">

                <Group spacing={4} position="center" noWrap={false}>
                    {machine.build_costs.map((product, key) => {
                        return <CostsBadge key={key} product={product} />
                    })}
                    <NeedsBage need="workers" value={machine.workers} />
                    {machine.maintenance_cost_units === 'maintenance_i' && (
                        <NeedsBage need="maintenance1" value={machine.maintenance_cost_quantity} />
                    )}
                    {machine.maintenance_cost_units === 'maintenance_iI' && (
                        <NeedsBage need="maintenance2" value={machine.maintenance_cost_quantity} />
                    )}
                    <NeedsBage need="electricity" value={machine.electricity_consumed} />
                    <NeedsBage need="unity" value={machine.unity_cost} />
                    <NeedsBage need="computing" value={machine.computing_consumed} suffix="tf" />
                </Group>

            </Box>


        </Box >


    );
}
