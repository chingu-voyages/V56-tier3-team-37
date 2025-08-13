'use client';

import React, { useState, useEffect } from 'react';
import {
    Autocomplete,
    TextField,
    Chip,
    Box,
    Typography,
    CircularProgress,
    ListItemText,
    ListItem,
    Divider
} from '@mui/material';
import {
    searchSurgeryTypes,
    getSurgeryTypesByCategory,
    SURGERY_CATEGORIES,
    type SurgeryType
} from '@/lib/surgery-types';

interface SurgeryTypeAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
    helperText?: string;
    disabled?: boolean;
    required?: boolean;
    label?: string;
    placeholder?: string;
    fullWidth?: boolean;
}

export default function SurgeryTypeAutocomplete({
    value,
    onChange,
    error = false,
    helperText,
    disabled = false,
    required = false,
    label = 'Surgery Type',
    placeholder = 'Search for surgery type...',
    fullWidth = true
}: SurgeryTypeAutocompleteProps) {
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState<SurgeryType[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    // Load initial options when component mounts
    useEffect(() => {
        setOptions(searchSurgeryTypes(''));
    }, []);

    // Handle input change for search
    const handleInputChange = (event: React.SyntheticEvent, newInputValue: string) => {
        setInputValue(newInputValue);

        if (newInputValue.length >= 2) {
            setLoading(true);
            const searchResults = searchSurgeryTypes(newInputValue);
            setOptions(searchResults);
            setLoading(false);
        } else if (newInputValue.length === 0) {
            setOptions(searchSurgeryTypes(''));
        }
    };

    // Handle selection change
    const handleChange = (event: React.SyntheticEvent, newValue: SurgeryType | null) => {
        if (newValue) {
            onChange(newValue.name);
        } else {
            onChange('');
        }
    };

    // Group options by category for better organization
    const groupedOptions = SURGERY_CATEGORIES.map(category => ({
        category,
        options: options.filter(option => option.category === category)
    })).filter(group => group.options.length > 0);

    // Custom render option to show category and description
    const renderOption = (props: React.HTMLAttributes<HTMLLIElement>, option: SurgeryType) => (
        <ListItem {...props} sx={{ flexDirection: 'row', alignItems: 'flex-start', py: 1 }}>
            {/* Subtle category indicator instead of repetitive icons */}
            <Box sx={{
                mr: 2,
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#07BEB8',
                opacity: 0.6,
                flexShrink: 0
            }} />
            <ListItemText
                primary={option.name}
                secondary={
                    <Box>
                        <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                            {option.category}
                        </Typography>
                        {option.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                {option.description}
                            </Typography>
                        )}
                    </Box>
                }
            />
        </ListItem>
    );

    // Custom render group header with category icon
    const renderGroup = (params: any) => {
        // Find the first option in this group to get the category icon
        const firstOption = options.find(option => option.category === params.group);
        const categoryIcon = firstOption?.icon || '🏥';

        return (
            <Box key={params.key}>
                <Divider sx={{ my: 1 }} />
                <Box
                    sx={{
                        px: 2,
                        py: 1.5,
                        mx: 1,
                        backgroundColor: 'rgba(7, 190, 184, 0.08)',
                        borderRadius: 1,
                        border: '1px solid rgba(7, 190, 184, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <Box sx={{ fontSize: '1.2rem' }}>
                        {categoryIcon}
                    </Box>
                    <Typography
                        variant="subtitle2"
                        color="primary"
                        sx={{
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}
                    >
                        {params.group}
                    </Typography>
                </Box>
                {params.children}
            </Box>
        );
    };

    return (
        <Autocomplete
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            value={value ? { name: value, id: '', category: '' } as SurgeryType : null}
            onChange={handleChange}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            options={options}
            getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
            isOptionEqualToValue={(option, value) =>
                option.name === (typeof value === 'string' ? value : value?.name)
            }
            renderOption={renderOption}
            renderGroup={renderGroup}
            groupBy={(option) => option.category}
            loading={loading}
            disabled={disabled}
            fullWidth={fullWidth}
            filterOptions={(x) => x} // Disable built-in filtering since we handle it manually
            noOptionsText={
                inputValue.length >= 2
                    ? "No surgery types found. Try a different search term."
                    : "Start typing to search for surgery types..."
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    placeholder={placeholder}
                    required={required}
                    error={error}
                    helperText={helperText}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            '& fieldset': {
                                borderColor: error ? '#EF4444' : '#E5E7EB',
                            },
                            '&:hover fieldset': {
                                borderColor: error ? '#EF4444' : '#07BEB8',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: error ? '#EF4444' : '#07BEB8',
                            },
                        },
                    }}
                />
            )}
            ListboxProps={{
                style: { maxHeight: 400 }
            }}
        />
    );
}
